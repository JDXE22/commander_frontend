import { useState } from "react";
import { getCommand } from "./services/commands";
import { Navbar } from "./components/navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import { Home } from "./components/home/Home";
import { FilterCmd } from "./components/pages/Filter/FilterCmd";

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
        setCommands("");
      }, 7000);
    });
  };

  return (
    <div className="App">
      <h1>Commander Terminal</h1>
      <Navbar />
      <div className="container">
      <Routes>
        <Route path="/" element={<Home handleInput={handleInput} inputText={inputText} handleFormSubmit={handleFormSubmit} commands={commands} />}/>
        <Route path="/filter" element={<FilterCmd commands={commands} /> }/>
      </Routes>
      </div>
    </div>
  );
}

export default App;
