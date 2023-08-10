import React, { useEffect, useRef, useState } from 'react'
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

export function Camera(props: { onPredictions: (predictions: Predictions) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [modelName, setModelName] = useLocalStorage('modelName', 'egohands-public')
    const [modelVersion, setModelVersion] = useLocalStorage('modelVersion', 9)
    const [model, setModel] = useState<any>()
    const [cameraLoading, setCameraLoading] = useState(true)
    const [modelLoading, setModelLoading] = useState(true)
    
    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        const video = videoRef.current
        if (video) {
          setCameraLoading(false)
          video.srcObject = stream
          video.play()
        }
      })

      return () => {
        const stream = videoRef.current?.srcObject as MediaStream
        stream?.getTracks().forEach(track => track.stop())
      }
    }, [])
    
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
      const video = videoRef.current!

      async function runPredictions () {
        if (model) {
          const predictions = await model.detect(video)
          props.onPredictions(predictions)
        }
        if (id === startCount) {
          setTimeout(runPredictions, 1000)
        }
      }

      if (video.paused) {
        video.onloadeddata = runPredictions
      } else {
        runPredictions()
      }
      
    }, [model, videoRef, props.onPredictions])
    
    return <>
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4 items-center justify-center">
        <label className="text-lg font-semibold text-gray-600">Camera</label>
        {cameraLoading && <div className="text-blue-500 w-full text-center">Initializing...</div>}
        <div>
          <video ref={videoRef} autoPlay playsInline className="w-full h-40 rounded-md"/>
        </div>
      </div>

      <div className="text-4xl">&darr;</div>

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