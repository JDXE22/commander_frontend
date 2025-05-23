import { saveCommand } from "../../../services/commands";
import { useState } from "react";

export const CreateCmd = ({ refresh }) => {
  const [commandInput, setCommandInput] = useState("");
  const [valuesInput, setValuesInput] = useState([]);
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setCommandInput(e.target.value);
  };
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  const handleValuesChange = (e) => {
    setValuesInput(e.target.value.split(","));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      command,
      text,
      values,
    };
    const res = saveCommand({ command: payload });
    if (!res.error) {
      refresh();
      setCommandInput("");
      setText("");
      setValuesInput([]);
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
          value={text}
          onChange={handleTextChange}
          placeholder="Text"
        />
        <input
          type="text"
          value={valuesInput.join(",")}
          onChange={handleValuesChange}
          placeholder="Values (comma separated)"
        />
        <button type="submit">Create Command</button>
      </form>
    </div>
  );
};
