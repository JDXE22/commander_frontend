import { useState } from "react";
import { getCommand, getCommands } from "../features/commands/api/apiCommands";
import { Navbar } from "./layout/Navbar";
import { Route, Routes } from "react-router-dom";
import { Home } from "../features/commands/lookup/Home";
import { FilterCmd } from "../features/commands/dashboard/FilterCmd";
import { CreateCmd } from "../features/commands/create/CreateCmd";

function App() {
  const [inputText, setInputText] = useState("");
  const [commands, setCommands] = useState(null);

  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    getCommand(inputText).then((command) => {
      const list = !command || command.error ? [] : [command];
      setCommands(list);
      setInputText("");
      setTimeout(() => {
        setCommands("");
      }, 7000);
    });
  };
  const fetchAllCommands = () => {
    getCommands({ page: 1 }).then((command) => {
      setCommands(command);
    });
  };

  return (
    <div className="App">
      <h1>Commander Terminal</h1>
      <Navbar />
      <div className="homeContainer">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                handleInput={handleInput}
                inputText={inputText}
                handleFormSubmit={handleFormSubmit}
                commands={commands}
              />
            }
          />
          <Route path="/filter" element={<FilterCmd commands={commands} />} />
          <Route
            path="/create"
            element={<CreateCmd refresh={fetchAllCommands} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
