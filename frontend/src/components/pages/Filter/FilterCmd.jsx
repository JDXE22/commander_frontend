export const FilterCmd = ({ value, handle }) => {
  const [filter, setFilter] = useState("");
  const [filteredCommands, setFilteredCommands] = useState([]);

  const handleCommand = (e) => {
    setFilter(e.target.value);
    const filtered = value.filter((cmd) => {
      return cmd.toLowerCase().includes(e.target.value.toLowerCase());
    });
    handle(filtered);
    setFilteredCommands(filtered);
  };

  return (
    <div>
      <h3>Filter all Commands</h3>\
      <input value={value} onChange={handleCommand} />
      <div>
        {filteredCommands.lenght > 0 ? (
          <ul>
            {filteredCommands.map((cmd) => (
              <li key={cmd.id}>{cmd}</li>
            ))}
          </ul>
        ) : (
          "No commands found"
        )}
      </div>
    </div>
  );
};
