import React, { useState } from 'react'
import { Camera } from './Camera'
import { CodeBlock } from './CodeBlock'
import { Model, Predictions } from './Model'
import { Action } from './Notification'

const arrows = {
  'left': '↙',
  'right': '↘',
  'down': '↓'
}

export function Flow (props: { video: HTMLVideoElement | undefined, direction: 'left' | 'right' | 'down', id: string }) {
  const [video, setVideo] = useState<HTMLVideoElement>()
  const [predictions, setPredictions] = useState<Predictions>()
  const [action, setAction] = useState(false)
  const arrow = arrows[props.direction]

  return <div className="mx-auto space-y-4 space-x-12 items-center flex flex-col">
    <Camera onVideo={setVideo} />
    <div className="text-4xl">{arrow}</div>
    <Model video={video} id={props.id} onPredictions={setPredictions} />
    <div className="text-4xl">{arrows.down}</div>
    <CodeBlock predictions={predictions} id={props.id} onAction={setAction} />
    <div className="text-4xl">{arrows.down}</div>
    <Action id={props.id} trigger={action} />
  </div>
}