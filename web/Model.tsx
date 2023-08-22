import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use';
import { Card, inputClass } from './Card';
import { VITE_ROBOFLOW_PUBLISHABLE_KEY } from './Main';

export type Predictions = {
  class: string,
  bbox: {
    x: number,
    y: number,
    width: number,
    height: number
  },
  confidence: number,
  color: string
}[]
  
let startCount = 0

export function Model(props: { video?: HTMLVideoElement, onPredictions: (p: Predictions) => void }) {
    const [modelName, setModelName] = useLocalStorage('modelName', 'egohands-public')
    const [modelVersion, setModelVersion] = useLocalStorage('modelVersion', 9)
    const [model, setModel] = useState<any>()
    const [modelLoading, setModelLoading] = useState(true)
    
    useEffect(() => {
      setModelLoading(true)
      const roboflow = (window as any).roboflow
      roboflow.auth({
        publishable_key: VITE_ROBOFLOW_PUBLISHABLE_KEY
      }).load({
        model: modelName,
        version: modelVersion
      }).then(async (model: any) =>{
        setModel(model)
      }).catch((error: any) => {
        console.log(error)
      }).finally(() => {
        setModelLoading(false)
      })
    }, [modelName, modelVersion]);
  
    useEffect(() => {
      let id = ++startCount
      const video = props.video
      if (!video || !model || !props.onPredictions) {
        return
      }
      
      async function runPredictions () {
        console.log(id, 'running')
        if (model) {
          const predictions = await model.detect(video)
          props.onPredictions(predictions)
        }
        if (startCount === id) { //ensure only latest version is run
          setTimeout(runPredictions, 1000)
        }
      }

      runPredictions()

    }, [model, props.video, props.onPredictions])
    
    return <Card title="Model" loadingText={modelLoading ? 'Initializing...' : ''}>
      <input type="text" placeholder="Model Name" value={modelName} onChange={e => setModelName(e.target.value)} className={inputClass('flex-grow')} />
      <input type="text" placeholder="Model Version" value={modelVersion} onChange={e => setModelVersion(+e.target.value)} className={inputClass('w-16')} />
    </Card>
  }