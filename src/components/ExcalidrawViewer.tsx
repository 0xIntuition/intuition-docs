import React, { useEffect, useState } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

type ExcalidrawInitialData = {
  elements?: any[];
  appState?: Record<string, any>;
  files?: Record<string, any>;
};

type ExcalidrawViewerProps = {
  src: string;
  zoom?: number;
  scrollX?: number;
  scrollY?: number;
};

export default function ExcalidrawViewer({ src, zoom = 0.6, scrollX = 0, scrollY = 0 }: ExcalidrawViewerProps) {
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
          viewBackgroundColor: '#ffffff',
          zoom: { value: zoom },
          scrollX: scrollX,
          scrollY: scrollY,
        };

        setData({ elements, appState: customAppState, files });
      } catch (err) {
        console.error('Error loading Excalidraw JSON:', err);
        setError('Failed to load diagram data');
      }
    };
    loadJSON();
  }, [src, zoom, scrollX, scrollY]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!ExcalidrawComponent) return <p>Loading Excalidraw component...</p>;
  if (!data) return <p>Loading diagram...</p>;

  return (
    <div style={{ height: 600, border: '1px solid #333', borderRadius: 12, marginBottom: '2rem' }}>
      <ExcalidrawComponent initialData={data} viewModeEnabled />
    </div>
  );
}
