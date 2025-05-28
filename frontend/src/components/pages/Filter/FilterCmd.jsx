import { useEffect, useState } from "react";
import { getCommands } from "../../../services/commands";
import { Button } from "../../button/Button";
import copyIcon from "../../../utils/img/copyIcon.svg";
import copiedIcon from "../../../utils/img/copiedIcon.png";
import { handleCopyClick } from "../../commands/Command";

const copyImageSrc = copyIcon;
const copiedImageSrc = copiedIcon;

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
                    handleCopyClick({ commandText: cmd.text, e: e , img1: copyImageSrc, img2: copiedImageSrc})
                  }
                  content={<img src={copyImageSrc} alt="Copy" />}
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
