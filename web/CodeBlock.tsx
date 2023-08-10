import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'
import { VITE_OPENAPI_KEY } from './Main'
import { Predictions } from './Camera'


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

The javascript code generated will be a function called "process" which accepts an array of predictions and return true if we are to proceed to the next step.

You can use the "this" context of the function to store or retrieve any state you wish to save between calls.  The function is called once per second.

IMPORTANT NOTE: you will reply with only javascript content and no other words. There should be no code before or after the function.
`


export type CodeEvalFunction = (p: Predictions) => boolean

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
  
function cleanMarkdownJs(markdown: string) {
  const regex = /```javascript\s*function\s*\w*\s*\(\w*\)\s*{([\s\S]*)}\s*```/gm;
  const match = regex.exec(markdown)
  if (!match) {
    throw new Error('malformed markdown: ' + markdown)
  }
  const body = match[1].trim()
  return new Function('predictions', body).bind({}) as CodeEvalFunction //TODO: validate
}


export function CodeBlock (props: { onEvalFunction: (fn: CodeEvalFunction) => void}) {
  const [editMode, setEditMode] = useState(true)
  const [prompt, setPrompt] = useLocalStorage('prompt', '')
  const [code, setCode] = useLocalStorage('code', '')
  const [llmLoading, setLlmLoading] = useState(false)
  const [llmError, setLlmError] = useState('')

  useEffect(() => {
    if (code) {
      try {
        props.onEvalFunction(cleanMarkdownJs(code))
      } catch (err) {
        console.error(err)
        setLlmError('error compiling function result')
      }
    }
  }, [code])

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
    ? <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4 items-center">
        <label className="text-lg font-semibold text-gray-600">LLM Block</label>
        <div className="text-red-500 w-full text-center">{llmError}</div>
        {llmLoading && <div className="text-blue-500 w-full text-center">Generating...</div>}
        <textarea 
          value={prompt} 
          onChange={x => setPrompt(x.currentTarget.value)} 
          className="p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 h-24 resize-y"/>
        <div className="flex justify-between w-full">
          <button 
            onClick={generateCode} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
          {code && (
            <button 
              onClick={() => setEditMode(false)} 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              &lt;/&gt;
            </button>
          )}
        </div>
      </div>
  
  
    : <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4 items-center">
        <pre className="bg-gray-100 p-4 rounded-md w-full text-sm overflow-x-auto">{code}</pre>
        <button 
          onClick={() => setEditMode(true)} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Edit
        </button>
      </div>

}
