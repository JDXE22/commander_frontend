export const Button = ({ handle, content, disabled}) => {
  return <button  onClick={handle} disabled={disabled}> {content} </button>;
};