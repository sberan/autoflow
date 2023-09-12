import React from 'react'

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

export function Card (props: { title: string, children: JSX.Element | JSX.Element[], loadingText?: string, errorText?: string, }) {
  return <>
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4 items-center justify-center">
      <label className="text-lg font-semibold text-gray-600">{props.title}</label>
      {props.loadingText && <div className="text-blue-500 w-full text-center">{props.loadingText}</div>}
      {props.errorText && <div className="text-red-500 w-full text-center">{props.errorText}</div>}
      {props.children}
    </div>
  </>
}