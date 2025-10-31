import React, { useEffect, useState } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

type ExcalidrawInitialData = {
  elements?: any[];
  appState?: Record<string, any>;
  files?: Record<string, any>;
};

export default function ExcalidrawViewer({ src }: { src: string }) {
  const [ExcalidrawComponent, setExcalidrawComponent] = useState<any>(null);
  const [data, setData] = useState<ExcalidrawInitialData>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (!ExecutionEnvironment.canUseDOM) return;

    // Dynamic import only on client side
    const loadExcalidraw = async () => {
      try {
        const mod = await import('@excalidraw/excalidraw');
        require('@excalidraw/excalidraw/index.css');
        setExcalidrawComponent(() => mod.Excalidraw);
      } catch (err) {
        console.error('Error loading Excalidraw:', err);
        setError('Failed to load Excalidraw component');
      }
    };
    loadExcalidraw();
  }, []);

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;

    const loadJSON = async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`Fetch error ${res.status}`);
        const json = await res.json();
        const { elements, files } = json;

        // Set custom appState to control the view
        const customAppState = {
          viewBackgroundColor: '#131417',
          zoom: { value: .5 },
          scrollX: 450,
          scrollY: 0,
        };

        setData({ elements, appState: customAppState, files });
      } catch (err) {
        console.error('Error loading Excalidraw JSON:', err);
        setError('Failed to load diagram data');
      }
    };
    loadJSON();
  }, [src]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!ExcalidrawComponent) return <p>Loading Excalidraw component...</p>;
  if (!data) return <p>Loading diagram...</p>;

  return (
    <div
      style={{
        height: 600,
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        marginBottom: '2rem',
        overflow: 'hidden'
      }}
    >
      <ExcalidrawComponent initialData={data} viewModeEnabled />
    </div>
  );
}
