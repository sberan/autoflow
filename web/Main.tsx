import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Action } from './Action';
import { Camera } from './Camera'
import { CodeBlock } from './CodeBlock'
import { Model, Predictions } from './Model';
import './index.css'

export const {
  VITE_OPENAPI_KEY,
  VITE_ROBOFLOW_PUBLISHABLE_KEY
} = (import.meta as { env: {[key: string]: string} }).env


function Main() {
  const [video, setVideo] = useState<HTMLVideoElement>()
  const [predictions, setPredictions] = useState<Predictions>()
  const [action, setAction] = useState(false)

  return (
    <div className="mx-auto space-y-4 items-center flex flex-col">
      <h1 className="text-4xl font-bold text-center max-w-2xl mx-auto">Autoflow</h1>
      <Camera onVideo={setVideo} />
      <div className="text-4xl">&darr;</div>
      <Model video={video} onPredictions={setPredictions} />
      <div className="text-4xl">&darr;</div>
      <CodeBlock predictions={predictions} onAction={setAction} />
      <div className="text-4xl">&darr;</div>
      <Action trigger={action} /> 
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Main/>)