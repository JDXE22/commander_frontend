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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredCommand = await getCommand(inputText);
      setCommands([filteredCommand]);
      setInputText("");
      setTimeout(() => {
        setCommands(null);
      }, 5000);

    } catch (error) {
      console.error("Error fetching command:", error);
      return;
    }
    setInputText(inputText)

  };
  const fetchAllCommands = async () => {
    const { commands: allCommands } = await getCommands({ page: 1 });
    setCommands(allCommands);
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
