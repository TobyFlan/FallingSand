import { Stage } from "@pixi/react";
import SandApp from "./SandApp";
import './App.css'

function App() {

  return (
    <>
      <h1>  </h1>
      <Stage width={800} height={600} options={{ backgroundColor: 0x000000 }}>
        <SandApp />
      </Stage>
    </>
  )
}

export default App
