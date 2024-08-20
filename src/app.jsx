import React from 'react';
import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <div>
      hello world
    </div>
  )
}

createRoot(document.getElementById("root")).render(<App />)