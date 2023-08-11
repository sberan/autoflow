import React, { ElementRef, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Action } from './Action';
import { Camera, Predictions } from './Camera'
import { CodeBlock, CodeEvalFunction } from './CodeBlock'
import './index.css'

export const {
  VITE_OPENAPI_KEY,
  VITE_ROBOFLOW_PUBLISHABLE_KEY
} = (import.meta as { env: {[key: string]: string} }).env


function Main() {
  const [llmProcessor, setLlmProcessor] = useState<CodeEvalFunction>(() => () => false);
  const [onPredictions, setOnPredictions] = useState<(predictions: Predictions) => void>(() => () => {})
  const action = useRef<ElementRef<typeof Action>>(null)

  useEffect(() => {
    setOnPredictions(() => (predictions: Predictions) => {
      console.log(predictions.map(x => x.class))
      const result = llmProcessor(predictions)
      console.log(result)
      if (!result) {
        return
      }
      if (result && action.current) {
        console.log('triggering alert')
        action.current.trigger()
      }
    });
  }, [llmProcessor]);


  const updateFunction = (f: any) => {
    console.log('updating call function', f.toString())
    setLlmProcessor(() => f);
  };

  return (
    <div className="mx-auto space-y-4 items-center flex flex-col">
      <h1 className="text-4xl font-bold text-center max-w-2xl mx-auto">Autoflow</h1>
      <Camera onPredictions={onPredictions} />
      <div className="text-4xl">&darr;</div>
      <CodeBlock onEvalFunction={updateFunction} />
      <div className="text-4xl">&darr;</div>
      <Action ref={action} /> 
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Main/>)