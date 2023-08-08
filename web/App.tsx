import React from 'react'
import { createRoot } from 'react-dom/client'



function Main () {
    return <h1>Hello World</h1>
}

createRoot(document.getElementById('root')!).render(<Main/>)

console.log('hi')



