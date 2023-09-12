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

function speak (content: string) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(content);

  synth.speak(utterance);
}

type ActionType = 'notification' | 'speak'

export const Action = (props: { trigger: boolean, id: string }) => {
  const [content, setContent] = useLocalStorage(`actionContent-${props.id}`, 'Stop touching your face!')
  const [type, setType] = useLocalStorage<ActionType>(`actionType-${props.id}`, 'notification')

  useEffect(() => {
    if (!content || !props.trigger) {
      return
    }
    if (type === 'notification') {
      fireNotification(content)
    }

    if (type === 'speak') {
      speak(content)
    }
  }, [props.trigger, content, type])

  return <Card title="Action">
    <select value={type} onChange={e => setType(e.target.value as ActionType)}>
      <option value='notification'>Notification</option>  
      <option value='speak'>Speak</option>  
    </select>

    <input type="text" value={content} onChange={e => setContent(e.target.value)} className={inputClass('w-full')}/>
  </Card>
}