import { useState , useRef,useMemo } from 'react'
import './App.css'


import { Editor } from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';




function App() {
  const editorRef = useRef(null);
  const [username,setUsername] = useState('');

  const ydoc = useMemo(()=> new Y.Doc,[]);
  const yText = useMemo(()=> ydoc.getText("monaco"),[ydoc]);

  const handleMount = (editor) => {
  editorRef.current = editor;

  const provider = new SocketIOProvider(
    "http://localhost:3000",
    "monaco",
    ydoc,
    {
      autoConnect: true,
    }
  );

  const monacoBinding = new MonacoBinding(
    yText,
    editorRef.current.getModel(),
    new Set([editorRef.current]),
    provider.awareness
  );
};

  return (
    <main className='h-screen w-full bg-gray-950 flex gap-4 p-4'>
      <aside className='h-full w-[40%] rounded-md overflow-hidden bg-amber-50'>

      </aside>

      <section className='hfull w-[60%] bg-neutral-800 rounded-lg overflow-hidden'>
          <Editor 
            height="100%"
            defaultLanguage='javascript'
            defaultValue='// some comment'
            theme='vs-dark'
            onMount={handleMount}
          />
      </section>
    </main>
  )
}

export default App
