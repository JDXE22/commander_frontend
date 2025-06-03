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
      <UIForm
        onChange={handleInput}
        value={inputText}
        handleSubmit={handleFormSubmit}
      />
      <CommandList command={commands} />
    </>
  );
};
