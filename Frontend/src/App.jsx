import React from 'react';
import CollaborationCanvas from './components/CollaborationCanvas';

function App() {
  return (
    <div style={{ 
      margin: 0, padding: 0, width: '100vw', height: '100vh', 
      overflow: 'hidden', backgroundColor: '#f1f5f9', fontFamily: 'sans-serif' 
    }}>
      {/* Dynamic Workspace Control Header */}
      <header style={{
        height: '60px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
          <h2 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
            MiroCanvas Enterprise Workspace
          </h2>
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>
          Status: Local Sandbox Mode (Day 3)
        </div>
      </header>

      {/* Main Core Render Wrapper Grid */}
      <main style={{ padding: '20px' }}>
        <CollaborationCanvas />
      </main>
    </div>
  );
}

export default App;