import React, { useEffect, useRef, useState } from 'react'
import { Card } from './Card';

export function Camera(props: { onVideo: (v: HTMLVideoElement) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraLoading, setCameraLoading] = useState(true)
    
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
      const video = videoRef.current
      if (!video) {
        return
      }

      if (video.paused) {
        video.onloadeddata = () => props.onVideo(video)
      } else {
        props.onVideo(video)
      }
    }, [videoRef, props.onVideo])

    return <Card title="Camera" loadingText={cameraLoading ? 'Initializing...' : ''}>
      <video ref={videoRef} autoPlay playsInline className="w-full h-40 rounded-md"/>
    </Card>
  }