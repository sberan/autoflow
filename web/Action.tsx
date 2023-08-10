import React, { forwardRef, useImperativeHandle } from 'react'
import { useLocalStorage } from 'react-use'

function fireNotification (content: string) {
    if (Notification.permission === 'granted') {
      new Notification(content)
    } else if (Notification.permission === 'denied') {
      alert(content)
    } else {
      Notification.requestPermission().finally(() => fireNotification(content)) //TODO we could request notifications up front
    }
  }
  
export const Action = forwardRef<{trigger: () => void}, {}>((_, ref) => {
  const [content, setContent] = useLocalStorage('actionContent', 'Stop touching your face!')

  useImperativeHandle(ref, () => ({
    trigger () {
      if (content) {
        fireNotification(content)
      }
    }
  }))

  return <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4 items-center">
    <label className="text-lg font-semibold text-gray-600">Notification</label>
    <input 
      type="text" 
      value={content} 
      onChange={e => setContent(e.target.value)} 
      className="p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
})