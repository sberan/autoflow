import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Action } from './Notification';
import { Camera } from './Camera'
import './index.css'
import { Flow } from './Flow';
import { useLocalStorage } from 'react-use';

export const {
  VITE_OPENAPI_KEY,
  VITE_ROBOFLOW_PUBLISHABLE_KEY
} = (import.meta as { env: {[key: string]: string} }).env



function Main() {
  const [numFlowsValue, setNumFlows] = useLocalStorage('numFlows', 1)
  const numFlows = numFlowsValue || 1

  function getDirection(id: number) {
    const middle = ((numFlows + 1) / 2.0) - 1
    if (id < middle) { return 'left' }
    if (id > middle) { return 'right' }
    return 'down'
  }

  const flows = [...Array(numFlows)].map((x, i) => {
    return {
      id: i.toString(),
      direction: getDirection(i)
    } as const
  })


  return (
    <div className="mx-auto space-y-4 items-center flex flex-col">
      <h1 className="text-4xl font-bold text-center max-w-2xl mx-auto">Autoflow</h1>
      <div className="flex flex-row items-center">
        <Camera />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Main/>)