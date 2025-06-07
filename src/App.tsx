import { useState } from "react";
import Canvas from "./components/Canvas";

function App() {
  return (
    <main className="w-full h-dvh bg-gray-200">
      <Canvas></Canvas>
      <div className="fixed top-0 w-full h-8 bg-black"></div>
    </main>
  );
}

export default App;
