import React, { useEffect, useRef, useState } from 'react'

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

    return <>
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4 items-center justify-center">
        <label className="text-lg font-semibold text-gray-600">Camera</label>
        {cameraLoading && <div className="text-blue-500 w-full text-center">Initializing...</div>}
        <div>
          <video ref={videoRef} autoPlay playsInline className="w-full h-40 rounded-md"/>
        </div>
      </div>
    </>
  }