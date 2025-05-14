import { useState } from "react";
import { Form } from "./components/input/Form";
import { getCommand } from "./services/commands";
import { CommandList } from "./components/commands/Command";

function App() {
  const [inputText, setInputText] = useState("");
  const [commands, setCommands] = useState([]);

  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    getCommand(inputText).then((command) => {
      setCommands(command);
      setInputText("");
      setTimeout(() => {
        setCommands("")
      }, 5000);
    });
  };

  return (
    <div>
      <h1>Commander Terminal</h1>
      <Form
        onChange={handleInput}
        value={inputText}
        handleSubmit={handleFormSubmit}
      />
      <CommandList command={commands} />
    </div>
  );
}

export default App;
