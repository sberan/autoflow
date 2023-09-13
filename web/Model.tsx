import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'
import { Card, CardList, inputClass } from './Card'
import { VITE_ROBOFLOW_PUBLISHABLE_KEY } from './Main'
import { CodeBlock } from './CodeBlock'

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
  
let startCount: {[key:string]: number} = {}

export function Model(props: { video?: HTMLVideoElement, id: string, onClose?: () => void }) {
    const [modelName, setModelName] = useLocalStorage(`modelName-${props.id}`, 'egohands-public')
    const [modelVersion, setModelVersion] = useLocalStorage(`modelVersion-${props.id}`, 9)
    const [model, setModel] = useState<any>()
    const [modelLoading, setModelLoading] = useState(true)
    const [predictions, setPredictions] = useState<Predictions>([])
    
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
      startCount[props.id] ||= 0
      let id = ++startCount[props.id]
      const video = props.video
      if (!video || !model) {
        return
      }
      
      async function runPredictions () {
        console.log(props.id, id, 'running')
        if (model) {
          const predictions = await model.detect(video)
          setPredictions(predictions)
        }
        if (startCount[props.id] === id) { //ensure only latest version is running
          setTimeout(runPredictions, 1000)
        }
      }

      runPredictions()

    }, [model, props.video, props.id])
    
    return <>
      <Card title="Model" loadingText={modelLoading ? 'Initializing...' : ''} onClose={props.onClose}>
        <div className="flex-row">
          <input type="text" placeholder="Model Name" value={modelName} onChange={e => setModelName(e.target.value)} className={inputClass('flex-grow')} />
          <input type="text" placeholder="Model Version" value={modelVersion} onChange={e => setModelVersion(+e.target.value)} className={inputClass('w-16')} />
        </div>
      </Card>
      
      <CardList storageKey={`codeBlocks-${props.id}`} item={(id, remove) =>
        <CodeBlock id={id} key={id} predictions={predictions} onClose={remove} /> } />
    </>
  }