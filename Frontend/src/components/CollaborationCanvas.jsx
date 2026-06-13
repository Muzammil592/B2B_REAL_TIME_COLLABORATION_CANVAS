import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export default function CollaborationCanvas() {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [currentTool, setCurrentTool] = useState('select'); // Options: 'select', 'rect', 'circle', 'pan'
  const [zoomRatio, setZoomRatio] = useState(100);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Initialize Fabric Canvas Instance with Production Settings
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 40,
      height: window.innerHeight - 120,
      backgroundColor: '#ffffff',
      selection: true,             // Enable group selection boxes
      stopContextMenu: true,       // Prevents browser right-click menu on canvas
    });

    fabricCanvasRef.current = canvas;

    // 2. Infinite Pan Engine (Mouse Interaction Event Listeners)
    canvas.on('mouse:down', function (opt) {
      const evt = opt.e;
      // Agar 'pan' tool select ho YA Alt Key pressed ho, toh panning activate hogi
      if (currentTool === 'pan' || evt.altKey === true) {
        this.isDragging = true;
        this.selection = false; // Disable object selection while panning
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });

    canvas.on('mouse:move', function (opt) {
      if (this.isDragging) {
        const e = opt.e;
        const vpt = this.viewportTransform; // Reference to 2D Transformation Matrix
        
        // Update Translation Vectors (X and Y offsets)
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        
        this.requestRenderAll(); // Re-draw frame with new matrix coordinate offsets
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });

    canvas.on('mouse:up', function () {
      if (this.isDragging) {
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        // Tool status reset parameters condition
        if (currentTool !== 'pan') {
          this.selection = true;
        }
      }
    });

    // 3. Mathematical Smooth Zoom Engine (Mouse Wheel Integration)
    canvas.on('mouse:wheel', function (opt) {
      const delta = opt.e.deltaY;
      let zoom = this.getZoom();
      
      // Multiplier factor to ensure exponential scale smoothness
      zoom *= 0.999 ** delta;
      
      // Limit scale boundaries to prevent mathematical clipping errors
      if (zoom > 20) zoom = 20;
      if (zoom < 0.05) zoom = 0.05;
      
      // Zoom centered directly on the current cursor pointer coordinates
      this.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      
      // Sync local UI state display
      setZoomRatio(Math.round(zoom * 100));
      
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // 4. Window Resize Observer Logic
    const handleResize = () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.setDimensions({
          width: window.innerWidth - 40,
          height: window.innerHeight - 120,
        });
        fabricCanvasRef.current.requestRenderAll();
      }
    };
    window.addEventListener('resize', handleResize);

    // Clean up connections on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [currentTool]);

  // 5. Dynamic Tool Switching Enforcement
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (currentTool === 'pan') {
      canvas.selection = false;
      canvas.defaultCursor = 'grab';
      // Freeze active object interaction models during global navigation pan
      canvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = false;
      });
    } else {
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      canvas.forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
      });
    }
    canvas.requestRenderAll();
  }, [currentTool]);

  // 6. Vector Shape Instantiation Core Helpers
  const addRectangle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: 200,
      top: 150,
      fill: '#3b82f6', // Premium Indigo/Blue color
      width: 120,
      height: 120,
      rx: 8,          // Smooth vector corner rounding variables
      ry: 8,
      cornerColor: '#1e293b',
      cornerSize: 8,
      transparentCorners: false,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    setCurrentTool('select'); // Reset to selection interaction layer
  };

  const addCircle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const circle = new fabric.Circle({
      left: 250,
      top: 200,
      fill: '#10b981', // Premium Mint Emerald green
      radius: 60,
      cornerColor: '#1e293b',
      cornerSize: 8,
      transparentCorners: false,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    setCurrentTool('select');
  };

  return (
    <div className="canvas-container" style={{ position: 'relative', width: '100%', height: 'calc(100vh - 100px)' }}>
      {/* 🛠️ TOP UTILITY CONTROLS TOOLBAR */}
      <div className="toolbar" style={{
        position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff',
        padding: '8px 16px', borderRadius: '12px', boxShadow: '0 4px 25px rgba(15, 23, 42, 0.08)',
        border: '1px solid #e2e8f0', fontFamily: 'sans-serif'
      }}>
        <button 
          onClick={() => setCurrentTool('select')} 
          style={{
            padding: '8px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer',
            backgroundColor: currentTool === 'select' ? '#1e293b' : '#f1f5f9',
            color: currentTool === 'select' ? '#ffffff' : '#475569', fontWeight: '600', transition: 'all 0.2s'
          }}>
          Selection
        </button>
        
        <button 
          onClick={() => setCurrentTool('pan')} 
          style={{
            padding: '8px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer',
            backgroundColor: currentTool === 'pan' ? '#1e293b' : '#f1f5f9',
            color: currentTool === 'pan' ? '#ffffff' : '#475569', fontWeight: '600', transition: 'all 0.2s'
          }}>
          Pan Workspace (Grab)
        </button>

        <span style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1' }} />

        <button onClick={addRectangle} style={{ padding: '8px 14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>+ Rectangle</button>
        <button onClick={addCircle} style={{ padding: '8px 14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>+ Circle</button>

        <span style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1' }} />

        <button 
          onClick={() => {
            if(window.confirm("Clear complete layout matrix?")) {
              fabricCanvasRef.current.clear();
              fabricCanvasRef.current.backgroundColor = '#ffffff';
            }
          }} 
          style={{ padding: '8px 14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          Reset Board
        </button>

        {/* Dynamic Matrix Scale Feedback Logger */}
        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', paddingLeft: '8px' }}>
          Scale: {zoomRatio}%
        </div>
      </div>

      {/* 🖼️ GRAPHICAL GRAPHICS RENDER TARGET */}
      <div style={{ 
        width: '100%', height: '100%', background: '#f8fafc', 
        borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px'
      }}>
        <canvas ref={canvasRef} style={{ borderRadius: '12px' }} />
      </div>
    </div>
  );
}