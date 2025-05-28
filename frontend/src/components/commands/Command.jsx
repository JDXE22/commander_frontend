import { Button } from "../button/Button";

export const handleCopyClick = ({ commandText, e, img1, img2 }) => {
  const btn = e.currentTarget;
  const imgElement = btn.querySelector("img");
  if (!imgElement) {
    navigator.clipboard
      .writeText(commandText)
      .then(() => {
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
      });
    return;
  }
  const originalSrc = imgElement.src;

  navigator.clipboard
    .writeText(commandText)
    .then(() => {
      imgElement.src = img2;
      setTimeout(() => {
        imgElement.src = img1;
      }, 2000);
    })
    .catch((err) => {
      console.error("Copy failed:", err);
      if (imgElement) {
        imgElement.src = originalSrc;
      }
    });
};

export const CommandList = ({ command }) => {
  return (
    <div className="responseArea">
      <p>{command.text}</p>
      <Button handle={(e)=> handleCopyClick({e: e, commandText: command.text})} content="Copy"/>
    </div>
  );
};
