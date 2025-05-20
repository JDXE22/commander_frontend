import { use, useEffect, useState } from "react";
import { getCommands } from "../../../services/commands";

const Button = ({ handle, text }) => {
  return <button onClick={handle}>{text}</button>;
};

export const FilterCmd = () => {
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [page, setPage] = useState(1);

  const commands = () => {
    getCommands({ page: page })
      .then((cmds) => {
        setFilteredCommands(cmds);
      })
  };

  useEffect(commands, [page]);

  return (
    <div className="filter">
      <h3>Filter all Commands</h3>

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

      <div>
        <Button handle={() => setPage(page - 1)} text="Previous" />
        <Button handle={() => setPage(page + 1)} text="Next" />
      </div>
    </div>
  );
};
