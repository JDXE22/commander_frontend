import { CopyButton } from "../button/Button";

export const CommandList = ({ command }) => {
  return (
    <div className="responseArea">
      <p>{command.text}</p>
      <CopyButton
        textToCopy={command.text}
        timeout={2000}
        className="copy-button"
      />
    </div>
  );
};
