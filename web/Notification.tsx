import React, { useEffect } from 'react'
import { useLocalStorage } from 'react-use'
import { Card, inputClass } from './Card'

function fireNotification (content: string) {
  if (Notification.permission === 'granted') {
    console.log('fire notification (already granted)')
    new Notification(content)
  } else if (Notification.permission === 'denied') {
    console.log('fire notification denied')
    alert(content)
  } else {
    console.log('requesting notification permission')
    Notification.requestPermission().finally(() => fireNotification(content)) //TODO we could request notifications up front
  }
}
  
export const Action = (props: { trigger: boolean }) => {
  const [content, setContent] = useLocalStorage('actionContent', 'Stop touching your face!')

  useEffect(() => {
    if (content && props.trigger) {
      fireNotification(content)
    }
  }, [props.trigger])

  return <Card title="Notification">
    <input type="text" value={content} onChange={e => setContent(e.target.value)} className={inputClass('w-full')}/>
  </Card>
}