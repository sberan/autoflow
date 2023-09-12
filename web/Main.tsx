import React from 'react'
import { createRoot } from 'react-dom/client'
import { Camera } from './Camera'
import './index.css'

export const {
  VITE_OPENAPI_KEY,
  VITE_ROBOFLOW_PUBLISHABLE_KEY
} = (import.meta as any as { env: {[key: string]: string} }).env



function Main() {
  return (
    <div className="mx-auto space-y-4 items-center flex flex-col">
      <h1 className="text-4xl font-bold text-center max-w-2xl mx-auto">Autoflow</h1>
      <Camera />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Main/>)