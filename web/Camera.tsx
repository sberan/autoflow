import React, { useEffect, useRef, useState } from 'react'
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
    const [model, setModel] = useState<any>()
    useEffect(() => {
      const roboflow = (window as any).roboflow
      roboflow.auth({
          publishable_key: VITE_ROBOFLOW_PUBLISHABLE_KEY
      }).load({
          model: "egohands-public",
          version: 9
      }).then(async (model: any) =>{
        setModel(model)
        const video = videoRef.current
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (video) {
          video.srcObject = stream
          video.play()
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  
      return () => {
        const stream = videoRef.current?.srcObject as MediaStream
        stream?.getTracks().forEach(track => track.stop())
      }
    }, [videoRef]);
  
    useEffect(() => {
      let stopped = false
      let id = ++startCount
      const video = videoRef.current!

      console.log('starting', id)
      async function runPredictions () {
        console.log('running ', id)
        if (model) {
          const predictions = await model.detect(video)
          props.onPredictions(predictions)
        }
        if (id === startCount) {
          setTimeout(runPredictions, 1000)
        } else {
          console.log(id, startCount)
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
    
    return (
      <video style={{width: '300px', height: 'auto'}} ref={videoRef} autoPlay playsInline/>
    )
  }