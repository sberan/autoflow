import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use';
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
    
    return <>

      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4 items-center">
        <label className="text-lg font-semibold text-gray-600">Model</label>
        {modelLoading && <div className="text-blue-500 w-full text-center">Initializing...</div>}
        <div className="flex items-center space-x-4 w-full">
          <input type="text" placeholder="Model Name" value={modelName} onChange={e => setModelName(e.target.value)} className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 flex-grow"/>
          <input type="text" placeholder="Model Version" value={modelVersion} onChange={e => setModelVersion(+e.target.value)} className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-16"/>
        </div>
      </div>
    </>
  }