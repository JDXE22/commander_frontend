import { CommandList } from "../list/Command";
import { UIForm } from "../../../shared/ui/Form/Form";

export const Home = ({
  handleInput,
  inputText,
  handleFormSubmit,
  commands,
}) => {
  return (
    <>
      <UIForm handleSubmit={handleFormSubmit} className="">
        <input
          type="text"
          value={inputText}
          onChange={handleInput}
          placeholder="Enter command to lookup"
          className="commandInput"
        />
      </UIForm>
      <CommandList command={commands} />
    </>
  );
};
