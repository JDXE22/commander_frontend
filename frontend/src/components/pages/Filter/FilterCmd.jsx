import { use, useEffect, useState } from "react";
import { getCommands } from "../../../services/commands";

const Button = ({ handle, text }) => {
  return <button onClick={handle}>{text}</button>;
};

export const FilterCmd = ({ value, handle, commands }) => {
  const [filter, setFilter] = useState("");
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getCommands({page: page}).then((cmds) => {
      setFilteredCommands(cmds);
    }).catch((err) => {
      setFilteredCommands([]);
    });
  }, [page]) ;

  const handleForm = (e) => {
    e.preventDefault();
  };

  const handleCommand = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="filter">
      <h3>Filter all Commands</h3>
      <form onSubmit={handleForm}>
        <input onChange={handleCommand} />
        <div>
          <ul className="commands">
            {filteredCommands.length > 0 ? (
              <ul>
                {filteredCommands.map((cmd) => (
                  <li key={cmd._id}>
                    {cmd.command} <br />
                    {cmd.text}
                  </li>
                ))}
              </ul>
            ) : (
              "No commands found"
            )}
          </ul>
        </div>
      </form>
      <div>
        <Button handle={() => setPage(page - 1)} text="Previous" />
        <Button handle={() => setPage(page + 1)} text="Next" />
      </div>
    </div>
  );
};
