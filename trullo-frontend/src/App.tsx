import { useState } from "react";

import "./App.css";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <KanbanBoard />
    </>
  );
}

export default App;
