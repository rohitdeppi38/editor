import { useState, useRef, useMemo } from 'react'
import './App.css'


import { Editor } from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';




function App() {
  const editorRef = useRef(null);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get('username') || '';
  });

  const [users, setUsers] = useState([]);

  const ydoc = useMemo(() => new Y.Doc, []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;

  };

  const handleJoin = (e) => {
    e.preventDefault();

    setUsername(e.target.username.value);
    window.history.pushState({}, '', `?username=${e.target.username.value}`);
  };

  useEffect(()=>{
      if(username && editorRef.current) {
        const provider = new SocketIOProvider('http://localhost:3000', 'monaco-demo', ydoc,{
          autoConnect : true,
        });

        provider.awareness.setLocalStateField('user',{username});

        provider.awareness.on('change',()=>{
          const states = Array.from(provider.awareness.getStates().values());
          setUsers(states.map(state=>state.user).filter(user=>Boolean(user.username)))
        })

        const monacoBinding = new MonacoBinding(
          yText,
          editorRef.current.getModel(),
          new Set([editorRef.current]),
          provider.awareness
        );

      }

    }
  ,[
    editorRef.current,
    username,
  ]);
    if (!username) {
      return (
        <main className='h-screen w-full bg-gray-950 flex gap-4 p-4'>
          <form className='h-screen w-full flex justify-center items-center' onSubmit={handleJoin}>
            <input placeholder="Enter your username..."
              className='bg-gray-800 p-2 rounded-md outline-none text-black'
              name='username'
            />

            <button className='p-2 rounded-md bg-amber-50 text-black ml-2'
              type='submit'
            >Join</button>
          </form>
        </main>
      )
    }

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
