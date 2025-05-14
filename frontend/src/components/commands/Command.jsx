const Button = ({text}) => {    
  const handleClick = (e) => {
    const btn = e.currentTarget;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = "Copy text";
        }, 2000);
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <button onClick={handleClick}>Copy text</button>
    </>
  );
};

export const CommandList = ({ command }) => {
  return (
    <div>
      <p>{command.text}</p>
      <Button text ={command.text} />
    </div>
  );
};
