import React, { useState } from 'react'
import { CodeBlock } from './CodeBlock'
import { Model, Predictions } from './Model'
import { Action } from './Notification'


export function Flow (props: { video: HTMLVideoElement | undefined, direction: 'left' | 'right' | 'down', id: string }) {
  const [predictions, setPredictions] = useState<Predictions>()
  const [action, setAction] = useState(false)
  
  return <div className="mx-auto space-y-4 space-x-12 items-center flex flex-col">
    <div className="text-4xl">{props.direction === 'left' ? '↙' : '↘'}</div>
    <Model video={props.video} id={props.id} onPredictions={setPredictions} />
    <div className="text-4xl">&darr;</div>
    <CodeBlock predictions={predictions} id={props.id} onAction={setAction} />
    <div className="text-4xl">&darr;</div>
    <Action id={props.id} trigger={action} />
  </div>
}