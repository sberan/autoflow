import React, { ElementRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Action } from './Action';
import { Camera, Predictions } from './Camera';
import { CodeBlock, CodeEvalFunction } from './CodeBlock';

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
      console.log('executing llm', predictions)
      const result = llmProcessor(predictions)
      console.log('result', result)
      if (!result) {
        return
      }
      if (result && action.current)
        action.current.trigger()
      });
  }, [llmProcessor]);


  const updateFunction = (f: any) => {
    console.log('updating call function', f.toString())
    setLlmProcessor(() => f);
  };

  return (
    <div>
      <Camera onPredictions={onPredictions} />
      <CodeBlock onEvalFunction={updateFunction} />
      <Action ref={action} /> 
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Main/>)