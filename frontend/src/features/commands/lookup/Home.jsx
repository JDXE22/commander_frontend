import { CommandList } from "../list/Command";
import { UIForm } from "../../../shared/ui/Form/Form";

export const Home = ({
  handleInput,
  inputText,
  handleFormSubmit,
  commands,
}) => {
  return (
    <div className="homeContainer">
      <h2>Command Lookup</h2>
      <UIForm handleSubmit={handleFormSubmit} className="">
        <input
          type="text"
          value={inputText}
          onChange={handleInput}
          placeholder="Enter command to lookup"
          className="commandInput"
        />
      </UIForm>

      {commands === null ? (
        <p>Loading commands…</p>
      ) : commands.length > 0 ? (
        <>
          <CommandList command={commands} className="responseArea" />
        </>
      ) : (
        <p>No commands found…</p>
      )}
    </div>
  );
};
