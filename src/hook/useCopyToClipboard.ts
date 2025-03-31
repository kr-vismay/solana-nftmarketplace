import { useState, useCallback } from "react";

const useCopyToClipboard = (timeout = 2000) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(
    (text: string) => {
      if (!navigator.clipboard) {
        console.error("Clipboard API not available");
        return;
      }
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), timeout);
        })
        .catch((err) => console.error("Failed to copy: ", err));
    },
    [timeout]
  );

  return { copied, copyToClipboard };
};

export default useCopyToClipboard;
