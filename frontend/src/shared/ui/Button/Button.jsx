import copyIcon from '../../../shared/utils/copyIcon.svg';
import copiedIcon from '../../../shared/utils/copiedIcon.png';
import { useEffect, useRef, useState } from 'react';

export const Button = ({
  handle,
  content,
  disabled,
  className = 'btn-primary',
}) => {
  return (
    <button onClick={handle} disabled={disabled} className={className}>
      {content}
    </button>
  );
};

export const CopyButton = ({
  textToCopy,
  timeout = 2000,
  onCopy,
  onError,
  className = 'copy-btn',
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef();

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopy && onCopy();
    } catch (error) {
      console.error('Copy failed:', error);
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
    <button
      onClick={handleCopyClick}
      className={className}
      style={{
        background: 'transparent',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        fontSize: '12px',
        fontFamily: 'var(--font-sans)',
        fontWeight: '600',
      }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--terminal-green)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export const UpdateButton = ({
  handle,
  content = 'Update',
  disabled = false,
  className = '',
  icon = <img src={copyIcon} alt='Update' />,
}) => {
  return (
    <button onClick={handle} disabled={disabled} className={className}>
      {content}
    </button>
  );
};
