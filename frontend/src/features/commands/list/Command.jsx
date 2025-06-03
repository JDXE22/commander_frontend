import { CopyButton } from "../../../shared/ui/Button/Button";

export const CommandList = ({ command, className = "" }) => {
  return (
    <div className={className} >
      {command.map((cmd) => (
        <div key={cmd._id} >
          <span className="commandText">{cmd.text}</span>
          <div className="commandActions">
            <CopyButton text={cmd.command} />
          </div>
        </div>
      ))}
    </div>
  );
};
