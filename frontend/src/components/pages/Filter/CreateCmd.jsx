import { saveCommand } from "../../../services/commands";
import { useState } from "react";

export const CreateCmd = ({ refresh }) => {
  const [commandInput, setCommandInput] = useState("");
  const [valuesInput, setValuesInput] = useState("");
  const [textInput, setTextInput] = useState("");

  const handleChange = (e) => {
    setCommandInput(e.target.value);
  };
  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };
  const handleValuesChange = (e) => {
    setValuesInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      command: commandInput,
      text: textInput,
      name: valuesInput,
    };
    if (!commandInput || !textInput || !valuesInput) {
      alert("Please fill all fields");
      return;
    }
    const res = saveCommand({ command: payload });
    if (!res.error) {
      refresh();
      setCommandInput("");
      setTextInput("");
      setValuesInput("");
    }
  };

  return (
    <div>
      <h2>Create Command</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={commandInput}
          onChange={handleChange}
          placeholder="Command"
        />
        <input
          type="text"
          value={textInput}
          onChange={handleTextChange}
          placeholder="Text"
        />
        <input
          type="text"
          value={valuesInput}
          onChange={handleValuesChange}
          placeholder="Name"
        />
        <button type="submit">Create Command</button>
      </form>
    </div>
  );
};
