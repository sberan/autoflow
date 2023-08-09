import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

type Predictions = {
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

function Camera(props: { onPredictions: (predictions: Predictions) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stopped = false
    const roboflow = (window as any).roboflow
    roboflow.auth({
        publishable_key: "rf_FBBygEPfleNj3eyN3Gq4crIkhi72"
    }).load({
        model: "egohands-public",
        version: 9
    }).then(async (model: any) =>{
      const video = videoRef.current
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (!video) {
        throw new Error ('no video ref supplied!')
      }
      video.srcObject = stream
      video.play()
      
      video.onloadeddata = async () => {
        while (!stopped) {
          const predictions = await model.detect(video)
          props.onPredictions(predictions)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    })
    .catch((error: any) => {
      console.log(error)
    })

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach(track => track.stop())
      stopped = true
    }
  }, []);
  return (
    <video ref={videoRef} autoPlay playsInline/>
  )
}

function Main () {
  return <div>
    <Camera onPredictions={onPredictions}/>
    {detected ? 'Detected' : ''}
  </div>
}

createRoot(document.getElementById('root')!).render(<Main/>)