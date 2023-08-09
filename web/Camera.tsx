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
    
    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        const video = videoRef.current
        if (video) {
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
      const roboflow = (window as any).roboflow
      roboflow.auth({
          publishable_key: VITE_ROBOFLOW_PUBLISHABLE_KEY
      }).load({
          model: modelName,
          version: modelVersion
      }).then(async (model: any) =>{
        setModel(model)
      })
      .catch((error: any) => {
        console.log(error)
      })
  
    }, [modelName, modelVersion]);
  
    useEffect(() => {
      let stopped = false
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
  
      return () => {
        console.log('stopping', id)
        stopped = true
      }
    }, [model, videoRef, props.onPredictions])
    
    return <div>
      <video style={{width: '300px', height: 'auto'}} ref={videoRef} autoPlay playsInline/>
      <input type="text" placeholder="Model Name" value={modelName} onChange={e => setModelName(e.target.value)}/>
      <input type="text" placeholder="Model Version" value={modelVersion} onChange={e => setModelVersion(+e.target.value)}/>
    </div>
  }