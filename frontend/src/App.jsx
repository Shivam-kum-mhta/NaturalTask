import { useState } from 'react'
import Home from './pages/home'
import './App.css'
import Header from './components/header'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Home />
      {/* <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
