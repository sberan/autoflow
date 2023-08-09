import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

const {
  VITE_OPENAPI_KEY,
  VITE_ROBOFLOW_PUBLISHABLE_KEY
} = (import.meta as { env: {[key: string]: string} }).env

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

type ChatGptResponse = {
  id: string,
  object: string,
  created: number,
  model: string,
  choices: {
    index: 0,
    message: {
      role: string,
      content: string
    },
    finish_reason: string
  }[],
  usage: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
  }
}


function Camera(props: { onPredictions: (predictions: Predictions) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stopped = false
    const roboflow = (window as any).roboflow
    roboflow.auth({
        publishable_key: VITE_ROBOFLOW_PUBLISHABLE_KEY
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

const LLM_SYSTEM_PROMPT = `
you are a tool for generating javascript code to take a specific action based on an array of predictions from a machine learning model.

The predictions have the following type:

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

When given a prompt, you will generate a javascript version of that prompt.

IMPORTANT NOTE: you will reply with only javascript content and no other words.

The javascript code will be a function called "process" which accepts an array of predictions and optionally returns an action. 

The action returned must be of the following values:
{ type: 'alert', content: string } | { type: 'display', content: 'string' }
`

function CodeBlock () {
  const [editMode, setEditMode] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState('')
  const [llmLoading, setLlmLoading] = useState(false)
  const [llmError, setLlmError] = useState('')
  const generateCode = () => {
    setLlmError('')
    setLlmLoading(true)
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VITE_OPENAPI_KEY}`
      }, 
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: LLM_SYSTEM_PROMPT
        },{
          role: "user",
          content: prompt
        }],
        temperature: 0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })
    .then(async res => {
      if (!res.ok) {
        throw new Error('bad response: ' + res.status)
      }
      const json = await res.json() as ChatGptResponse //todo: validate me
      const code = json.choices[0].message.content
      setCode(code)
    })
    .catch(err => {
      console.error(err)
      setLlmError('Error generating code, please try again')
    })
    .finally(() => setLlmLoading(false))
  }

  return editMode
    ? <div>
        {llmError} {llmLoading && 'loading...'}
        <textarea value={prompt} onChange={x => setPrompt(x.currentTarget.value)}/>
        <button onClick={generateCode}>Save</button>
        {code && <button onClick={() => setEditMode(false)}>&lt;/&gt;</button> }
      </div>
    : <div>
        <code>{code}</code>
        <button onClick={() => setEditMode(true)}>edit</button>
      </div>

}

function Main () {
  const [detected, setDetected] = useState(false)
  const onPredictions = (p: Predictions) => {
    setDetected(p.length > 0)
  }

  return <div>
    <Camera onPredictions={onPredictions}/>
    {detected ? 'Detected' : ''}
    <CodeBlock/>
  </div>
}

createRoot(document.getElementById('root')!).render(<Main/>)