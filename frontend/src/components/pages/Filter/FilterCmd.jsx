import { use, useEffect, useState } from "react";
import { getCommands } from "../../../services/commands";
import { Button } from "../../button/Button";

export const FilterCmd = () => {
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const handleCopyClick = ({ commandText, e }) => {
    const btn = e.currentTarget;

    navigator.clipboard
      .writeText(commandText)
      .then(() => {
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = "Copy";
        }, 2000);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
      });
  };

  return (
    <div className="filter">
      <h3>Filter all Commands</h3>
      <div>
        <ul className="commands">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <li key={cmd._id}>
                <strong>{cmd.command}</strong> <br />
                <p>{cmd.text}</p>
                <Button
                  handle={(e) =>
                    handleCopyClick({ commandText: cmd.text, e: e })
                  }
                  content="Copy"
                  className="copy-button"
                />
              </li>
            ))
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
