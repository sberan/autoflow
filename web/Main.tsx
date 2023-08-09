import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Camera, Predictions } from './Camera';
import { CodeBlock, CodeEvalFunction } from './CodeBlock';

export const {
  VITE_OPENAPI_KEY,
  VITE_ROBOFLOW_PUBLISHABLE_KEY
} = (import.meta as { env: {[key: string]: string} }).env

function Main() {
  const [llmProcessor, setLlmProcessor] = useState<CodeEvalFunction>(() => () => {});
  const [onPredictions, setOnPredictions] = useState<(predictions: Predictions) => void>(() => () => {})

  useEffect(() => {
    setOnPredictions(() => (predictions: Predictions) => {
      console.log('executing llm', predictions)
      const result = llmProcessor(predictions)
      console.log('result', result)
      if (!result) {
        return
      }
      if (result && result.type === 'notification')
        alert(result.content)
      });
  }, [llmProcessor]);


  const updateFunction = (f: any) => {
    console.log('updating', f.toString())
    setLlmProcessor(() => f);
  };

  return (
    <div>
      <Camera onPredictions={onPredictions} />
      <CodeBlock onEvalFunction={updateFunction} />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Main/>)