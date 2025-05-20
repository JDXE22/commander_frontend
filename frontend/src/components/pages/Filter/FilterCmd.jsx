import { use, useEffect, useState } from "react";
import { getCommands } from "../../../services/commands";

const Button = ({ handle, text }) => {
  return <button onClick={handle}>{text}</button>;
};

export const FilterCmd = () => {
  const [filteredCommands, setFilteredCommands] = useState({
    commands: [],
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const commands = () => {
    getCommands({ page: page }).then(
      ({ commands: cmds, totalPages: total }) => {
        setFilteredCommands(cmds || []);
        setTotalPages(total || 1);
      }
    );
  };

  useEffect(commands, [page]);

  const renderPageNumbers = () => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div>
        {pageNumbers.map((number) => {
          return (
            <Button
              key={number}
              handle={() => setPage(number)}
              text={number}
            />
          );
        })}
      </div>
    );
  };

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
        {renderPageNumbers()}
        <Button handle={() => setPage(page + 1)} text="Next" />
      </div>
    </div>
  );
};
