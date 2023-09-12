import React, { useEffect, useRef, useState } from 'react'
import { useLocalStorage } from 'react-use';
import { Card, arrows } from './Card';
import { v4 as uuid } from 'uuid'
import { Model } from './Model';



export function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraLoading, setCameraLoading] = useState(true)
    const [videoLoaded, setVideoLoaded] = useState<HTMLVideoElement>()
    const [childIds, setChildIds] = useLocalStorage('modelIds', [uuid()])
    
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

      {arrows.down}

      {videoLoaded && childIds?.map(id => <Model key={id} id={id} video={videoRef.current!} />)}
    </>
  }