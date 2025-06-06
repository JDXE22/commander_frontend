import copyIcon from "../../../shared/utils/copyIcon.svg";
import copiedIcon from "../../../shared/utils/copiedIcon.png";
import { useEffect, useRef, useState } from "react";

export const Button = ({ handle, content, disabled }) => {
  return (
    <button onClick={handle} disabled={disabled}>
      {" "}
      {content}{" "}
    </button>
  );
};

export const CopyButton = ({
  textToCopy,
  timeout = 2000,
  onCopy,
  onError,
  className = "",
  icon = <img src={copyIcon} alt="Copy" />,
  copiedIconElement = <img src={copiedIcon} alt="Copied" />,
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef();
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopy && onCopy();
    } catch (error) {
      console.error("Copy failed:", error);
      onError && onError(error);
    }
  };

  useEffect(() => {
    if (copied) {
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, timeout);
    }
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [copied, timeout]);

  return (
    <button onClick={handleCopyClick} className={className}>
      {copied ? copiedIconElement : icon}
    </button>
  );
};

export const UpdateButton = ({
  handle,
  content = "Update",
  disabled = false,
  className = "",
  icon = <img src={copyIcon} alt="Update" />,
}) => {
  return (
    <button onClick={handle} disabled={disabled} className={className}>
      {content}
    </button>
  );
};
