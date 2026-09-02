import { useState } from 'react'
import './App.css'
import { Editor } from '@monaco-editor/react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className='h-screen w-full bg-gray-950 flex gap-4 p-4'>
      <aside className='h-full w-1/5 rounded-md overflow-hidden bg-amber-50'>

      </aside>

      <section className='hfull w-3/4 bg-neutral-800 rounded-lg overflow-hidden'>
          <Editor 
            height="100%"
            defaultLanguage='javascript'
            defaultValue='// some comment'
            theme='vs-dark'

          />
      </section>
    </main>
  )
}

export default App
