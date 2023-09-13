import React, { ReactNode } from 'react'
import { useLocalStorage } from 'react-use'
import { v4 as uuid } from 'uuid'

export const inputClass = (additional: string = '') => {
  return `p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${additional}`
}

export const buttonClass = (type: 'primary' | 'secondary', additional:string = '') => {
  const bgColors = {
    'primary': 'bg-blue-500 hover:bg-blue-700',
    'secondary': 'bg-gray-300 hover:bg-gray-400'
  }
  const textColors = {
    'primary': 'text-white',
    'secondary': 'text-gray-800'
  }
  const bgColor = bgColors[type]
  const textColor = textColors[type]
  return `${bgColor} ${textColor} font-bold py-2 px-4 rounded ${additional}`
}



export const arrows = {
  'left': <div className="text-4xl">↙</div>,
  'right': <div className="text-4xl">↘</div>,
  'down': <div className="text-4xl">↓</div>
}

export function Card (props: { title: string, children: JSX.Element | JSX.Element[], loadingText?: string, errorText?: string, onClose?: () => void }) {
  return <>
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4 items-center justify-center relative">
      {props.onClose && <button onClick={() => props.onClose && props.onClose()} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">✕</button> }
      <label className="text-lg font-semibold text-gray-600">{props.title}</label>
      {props.loadingText && <div className="text-blue-500 w-full text-center">{props.loadingText}</div>}
      {props.errorText && <div className="text-red-500 w-full text-center">{props.errorText}</div>}
      {props.children}
    </div>
  </>
}

export function CardList (props: { storageKey: string, item: (id: string, remove?: (() => void)) => ReactNode }) {
  const [actions, setActions] = useLocalStorage(props.storageKey, [uuid()])

  return <div className="flex flex-row space-x-4 items-center justify-center">
    {actions?.map(id => <div className="flex flex-col">
      <button onClick={() => setActions(actions?.concat(uuid()))}>{arrows.down}</button>
      {props.item(id, actions.length <= 1 ? undefined : () => setActions(actions.filter(x => x !== id)))}
    </div>)}
  </div>
}
