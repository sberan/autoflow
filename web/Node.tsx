

type NotificationNode = {
  type: 'notification'
  content: string
}

type CodeBlockNode = {
  type: 'code'
  prompt: string
  code: string
  action: NotificationNode
}

type ModelNode = {
  type: 'model'
  name: string
  version: string
  children: CodeBlockNode[]
}

type CameraNode = {
  type: 'camera'
  children: ModelNode[]
}

type NodeDef = { id: string} & CameraNode | ModelNode | CodeBlockNode | NotificationNode


export function Node (props: { def: NodeDef }) {
  
}