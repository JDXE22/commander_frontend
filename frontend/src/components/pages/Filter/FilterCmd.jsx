import { useEffect, useState } from "react";
import { getCommands, updateCommand } from "../../../services/commands";
import { Button, CopyButton, UpdateButton } from "../../button/Button";

export const FilterCmd = () => {
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatedInput, setUpdatedInput] = useState({});

  const fetchCommands = () => {
    getCommands({ page: page }).then(
      ({ commands: cmds, totalPages: total }) => {
        setFilteredCommands(cmds || []);
        setTotalPages(total || 1);
      }
    );
  };

  useEffect(fetchCommands, [page]);

  const renderPageNumbers = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div>
        {pageNumbers.map((number) => {
          return (
            <Button
              key={number}
              handle={() => setPage(number)}
              content={number}
            />
          );
        })}
      </div>
    );
  };

  const handlePageChange = (delta) => {
    setPage((p) => {
      const next = p + delta;
      return next < 1 || next > totalPages ? p : next;
    });
  };

  const handleUpdate = async ({ id, updatedData }) => {
    await updateCommand({ updatedData, id });
    setUpdatedInput((prev) => {
      const newInput = { ...prev };
      delete newInput[id];
      return newInput;
    });
    fetchCommands();
  };

  return (
    <div className="filter">
      <h3>Filter all Commands</h3>
      <div>
        <ul className="commands">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command) => {
              const currentText = updatedInput[command._id] ?? command.text;
              return (
                <li key={command._id}>
                  <span className="command-name">{command.command}</span>
                  <span className="command-text">
                    <textarea
                      rows={4}
                      type="text"
                      value={currentText}
                      onChange={(e) =>
                        setUpdatedInput((prev) => ({
                          ...prev,
                          [command._id]: e.target.value,
                        }))
                      }
                    />
                  </span>
                  <div className="buttons-container">
                  <CopyButton textToCopy={command.text} className="copy-button" />
                  <UpdateButton className="update-button"
                    disabled={currentText === command.text}
                    handle={() =>
                      handleUpdate({
                        id: command._id,
                        updatedData: { text: currentText },
                      })
                    }
                  />
                  </div>
                </li>
              );
            })
          ) : (
            <li>No commands found</li>
          )}
        </ul>
      </div>
      <div className="pagination">
        <Button
          handle={() => handlePageChange(-1)}
          content="Previous"
          disabled={page === 1}
        />
        {renderPageNumbers()}
        <Button
          handle={() => handlePageChange(1)}
          content="Next"
          disabled={page === totalPages}
        />
      </div>
    </div>
  );
};
