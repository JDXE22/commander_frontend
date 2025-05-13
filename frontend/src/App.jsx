import { useState } from "react";
import { Form } from "./components/input/Form";

function App() {
  const [inputText, setInputText] = useState('')
  const [commands, setCommands] = useState([])

  const handleInput = (e) => {  
    setInputText(e.target.value)
  }

  
  return (<div> 
    <h1>Commander Terminal</h1>
    <Form onChange={handleInput} value={inputText} />

  </div>)
}

export default App;
