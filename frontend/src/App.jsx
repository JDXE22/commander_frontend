import { useState } from "react";
import { Form } from "./components/input/Form";
import { getCommand } from "./services/commands";

function App() {
  const [inputText, setInputText] = useState("");
  const [commands, setCommands] = useState([]);

  const handleInput = (e) => {
    setInputText(e.target.value);
    if (e === "Enter") {
      getCommand(inputText).then((cmd) => {
        console.log("promise fulfilled");
        setCommands(cmd)
        setInputText("")
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h1>Commander Terminal</h1>
      <Form onChange={handleInput} value={inputText} />
    </div>
  );
}

export default App;
