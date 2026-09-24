import { useState, useMemo, useEffect } from 'react';
import './App.css';

import { Editor } from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

function App() {
  const [editor, setEditor] = useState(null);

  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get('username') || '';
  });

  const [users, setUsers] = useState([]);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText('monaco'), [ydoc]);

  const handleMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  const handleJoin = (e) => {
    e.preventDefault();

    const name = e.target.username.value.trim();

    if (!name) return;

    setUsername(name);

    window.history.pushState(
      {},
      '',
      `?username=${encodeURIComponent(name)}`
    );
  };

  useEffect(() => {
    // Wait until both username and Monaco editor exist
    if (!username || !editor) return;

    const provider = new SocketIOProvider(
      '/',
      'monaco-demo',
      ydoc,
      {
        autoConnect: true,
      }
    );

    provider.awareness.setLocalStateField('user', {
      username,
    });

    const updateUsers = () => {
      const states = Array.from(
        provider.awareness.getStates().values()
      );

      const connectedUsers = states
        .filter(
          (state) =>
            state.user &&
            state.user.username
        )
        .map((state) => state.user);

      setUsers(connectedUsers);
    };

    provider.awareness.on('change', updateUsers);

    // Get initial users
    updateUsers();

    const monacoBinding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    const handleBeforeUnload = () => {
      provider.awareness.setLocalState(null);
    };

    window.addEventListener(
      'beforeunload',
      handleBeforeUnload
    );

    return () => {
      provider.awareness.off('change', updateUsers);

      monacoBinding.destroy();

      provider.awareness.setLocalState(null);

      provider.disconnect();

      window.removeEventListener(
        'beforeunload',
        handleBeforeUnload
      );
    };
  }, [username, editor, ydoc, yText]);

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
        <form
          className="h-screen w-full flex justify-center items-center"
          onSubmit={handleJoin}
        >
          <input
            placeholder="Enter your username..."
            className="bg-gray-800 p-2 rounded-md outline-none text-white"
            name="username"
          />

          <button
            className="p-2 rounded-md bg-amber-50 text-black ml-2"
            type="submit"
          >
            Join
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="h-full w-[40%] rounded-md overflow-hidden bg-amber-50">
        <h2 className="text-2xl font-bold bg-gray-800 text-white rounded mb-2">
          Users
        </h2>

        <ul className="p-4">
          {users.map((user, index) => (
            <li
              key={index}
              className="p-2 border-b border-gray-300"
            >
              {user.username}
            </li>
          ))}
        </ul>
      </aside>

      <section className="h-full w-[60%] bg-neutral-800 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
}

export default App;