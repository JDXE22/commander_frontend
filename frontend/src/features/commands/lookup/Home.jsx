import { CommandList } from "../list/Command";
import { Form } from "../../../shared/ui/Form/Form";

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
