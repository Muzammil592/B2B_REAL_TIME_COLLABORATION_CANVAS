import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { io } from 'socket.io-client';

export default function CollaborationCanvas() {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const socketRef = useRef(null);
  const [currentTool, setCurrentTool] = useState('select'); 
  const [zoomRatio, setZoomRatio] = useState(100);
  
  const boardId = "default-production-board"; 

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Initialize Fabric Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 40,
      height: window.innerHeight - 120,
      backgroundColor: '#ffffff',
      selection: true,
      stopContextMenu: true,
    });

    fabricCanvasRef.current = canvas;

    // 2. Connect to Socket Server (Port 5001 matching Docker setup)
    socketRef.current = io("http://localhost:5001");
    
    socketRef.current.emit("join-board", boardId);

    // 3. REMOTE UPDATES HANDLER (Jab dusra user kuch kare)
    socketRef.current.on("canvas-update-remote", (payload) => {
      const activeObjects = canvas.getObjects();
      const targetObj = activeObjects.find(obj => obj.id === payload.objData.id);

      if (targetObj) {
        // Agar object pehle se exist karta hai toh uski properties update karein
        targetObj.set(payload.objData);
        targetObj.setCoords();
        canvas.requestRenderAll();
      } else {
        // Agar naya object hai jo remote par bana hai
        let newShape;
        if (payload.type === 'rect' || payload.type === 'Rect') {
          newShape = new fabric.Rect(payload.objData);
        } else if (payload.type === 'circle' || payload.type === 'Circle') {
          newShape = new fabric.Circle(payload.objData);
        }

        if (newShape) {
          canvas.add(newShape);
          canvas.requestRenderAll();
        }
      }
    });

    // 4. Infinite Pan Logic
    canvas.on('mouse:down', function (opt) {
      const evt = opt.e;
      if (currentTool === 'pan' || evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });

    canvas.on('mouse:move', function (opt) {
      if (this.isDragging) {
        const e = opt.e;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });

    canvas.on('mouse:up', function () {
      if (this.isDragging) {
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        if (currentTool !== 'pan') this.selection = true;
      }
    });

    // 5. Zoom Engine
    canvas.on('mouse:wheel', function (opt) {
      const delta = opt.e.deltaY;
      let zoom = this.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.05) zoom = 0.05;
      this.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      setZoomRatio(Math.round(zoom * 100));
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // 6. LOCAL MUTATION BROADCASTER (Drag, Scale, Rotate hone par trigger)
    const broadcastObjectMutation = (options) => {
      const target = options.target;
      if (!target) return;

      const serializedData = target.toJSON(['id']); 

      socketRef.current.emit("canvas-update", {
        boardId,
        type: target.type,
        objData: serializedData
      });
    };

    canvas.on('object:modified', broadcastObjectMutation);
    canvas.on('object:moving', broadcastObjectMutation);
    canvas.on('object:scaling', broadcastObjectMutation);
    canvas.on('object:rotating', broadcastObjectMutation);

    const handleResize = () => {
      canvas.setDimensions({ width: window.innerWidth - 40, height: window.innerHeight - 120 });
      canvas.requestRenderAll();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (socketRef.current) socketRef.current.disconnect();
      canvas.dispose();
    };
  }, [currentTool]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (currentTool === 'pan') {
      canvas.selection = false;
      canvas.defaultCursor = 'grab';
      canvas.forEachObject(obj => { obj.selectable = false; obj.evented = false; });
    } else {
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      canvas.forEachObject(obj => { obj.selectable = true; obj.evented = true; });
    }
    canvas.requestRenderAll();
  }, [currentTool]);

  // Handle Local Rectangle Creation and Instant Broadcast
  const addRectangle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const uniqueId = `rect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const rect = new fabric.Rect({
      id: uniqueId, 
      left: 200, top: 150,
      fill: '#3b82f6', width: 120, height: 120,
      rx: 8, ry: 8,
      cornerColor: '#1e293b', cornerSize: 8, transparentCorners: false,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();

    // Pehle custom 'id' proper data network me pass nahi ho raha tha, ab explicit send karein
    const dataToSend = rect.toJSON(['id']);
    dataToSend.id = uniqueId; 

    socketRef.current.emit("canvas-update", {
      boardId,
      type: 'rect',
      objData: dataToSend
    });
    setCurrentTool('select');
  };

  // Handle Local Circle Creation and Instant Broadcast
  const addCircle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const uniqueId = `circle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const circle = new fabric.Circle({
      id: uniqueId, 
      left: 250, top: 200,
      fill: '#10b981', radius: 60,
      cornerColor: '#1e293b', cornerSize: 8, transparentCorners: false,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.requestRenderAll();

    const dataToSend = circle.toJSON(['id']);
    dataToSend.id = uniqueId;

    socketRef.current.emit("canvas-update", {
      boardId,
      type: 'circle',
      objData: dataToSend
    });
    setCurrentTool('select');
  };

  return (
    <div className="canvas-container" style={{ position: 'relative', width: '100%', height: 'calc(100vh - 100px)' }}>
      <div className="toolbar" style={{
        position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff',
        padding: '8px 16px', borderRadius: '12px', boxShadow: '0 4px 25px rgba(15, 23, 42, 0.08)',
        border: '1px solid #e2e8f0', fontFamily: 'sans-serif'
      }}>
        <button onClick={() => setCurrentTool('select')} style={{ padding: '8px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: currentTool === 'select' ? '#1e293b' : '#f1f5f9', color: currentTool === 'select' ? '#ffffff' : '#475569', fontWeight: '600' }}>Selection</button>
        <button onClick={() => setCurrentTool('pan')} style={{ padding: '8px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: currentTool === 'pan' ? '#1e293b' : '#f1f5f9', color: currentTool === 'pan' ? '#ffffff' : '#475569', fontWeight: '600' }}>Pan Workspace</button>
        <span style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1' }} />
        <button onClick={addRectangle} style={{ padding: '8px 14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>+ Rectangle</button>
        <button onClick={addCircle} style={{ padding: '8px 14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>+ Circle</button>
        <span style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1' }} />
        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700' }}>Scale: {zoomRatio}%</div>
      </div>

      <div style={{ width: '100%', height: '100%', background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}