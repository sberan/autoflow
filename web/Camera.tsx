import React, { useEffect, useRef, useState } from 'react'
import { Card, CardList } from './Card'
import { Model } from './Model';



export function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraLoading, setCameraLoading] = useState(true)
    const [videoLoaded, setVideoLoaded] = useState<HTMLVideoElement>()
    
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
        video.onloadeddata = () => setVideoLoaded(video)
      } else {
        setVideoLoaded(video)
      }
    }, [videoRef])

    return <><Card title="Camera" loadingText={cameraLoading ? 'Initializing...' : ''}>
        <video ref={videoRef} autoPlay playsInline className="w-full h-40 rounded-md"/>
      </Card>

      {videoLoaded &&
        <CardList storageKey="modelIds" item={(id, remove) =>
          <Model key={id} id={id} video={videoRef.current!} onClose={remove} />} />
      }
    </>
  }