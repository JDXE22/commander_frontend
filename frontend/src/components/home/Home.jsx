import { CommandList } from "../../features/commands/list/Command";
import { Form } from "../../features/commands/create/CreateForm";

export const Home = ({
  handleInput,
  inputText,
  handleFormSubmit,
  commands,
}) => {
  return (
    <>
      <Form
        onChange={handleInput}
        value={inputText}
        handleSubmit={handleFormSubmit}
      />
      <CommandList command={commands} />
    </>
  );
};
