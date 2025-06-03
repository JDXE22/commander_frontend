import { CommandList } from "../../features/commands/list/Command";
import { Form } from "../input/Form";

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
