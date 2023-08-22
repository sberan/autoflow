import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Action } from './Notification';
import { Camera } from './Camera'
import './index.css'
import { Flow } from './Flow';

export const {
  VITE_OPENAPI_KEY,
  VITE_ROBOFLOW_PUBLISHABLE_KEY
} = (import.meta as { env: {[key: string]: string} }).env


function Main() {
  const [video, setVideo] = useState<HTMLVideoElement>()

  return (
    <div className="mx-auto space-y-4 items-center flex flex-col">
      <h1 className="text-4xl font-bold text-center max-w-2xl mx-auto">Autoflow</h1>
      <Camera onVideo={setVideo} />
      <div className="flex flex-row items-center">
        <Flow video={video} id="0" direction="left" />
        <Flow video={video} id="1" direction="right" />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Main/>)