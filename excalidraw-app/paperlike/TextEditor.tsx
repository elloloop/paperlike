/**
 * TextEditor Component
 * 
 * A simple text editor for handling paragraph input in the Paperlike document.
 */

import React, { useCallback, useRef, useEffect } from "react";
import type { TextBlock } from "./types";
import "./TextEditor.scss";

interface TextEditorProps {
  block: TextBlock;
  isActive: boolean;
  onContentChange: (blockId: string, content: string) => void;
  onEnterKey: (blockId: string) => void;
  onFocus: (blockId: string) => void;
  onBlur: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  block,
  isActive,
  onContentChange,
  onEnterKey,
  onFocus,
  onBlur,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onContentChange(block.id, e.target.value);
    },
    [block.id, onContentChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onEnterKey(block.id);
      }
    },
    [block.id, onEnterKey],
  );

  const handleFocus = useCallback(() => {
    onFocus(block.id);
  }, [block.id, onFocus]);

  return (
    <div
      className="paperlike-text-block"
      style={{
        position: "absolute",
        left: `${block.x}px`,
        top: `${block.y}px`,
        width: "600px",
        minHeight: `${block.height}px`,
      }}
    >
      <textarea
        ref={textareaRef}
        className="paperlike-textarea"
        value={block.content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={onBlur}
        placeholder="Type here..."
        rows={1}
        style={{
          fontSize: block.formatting?.fontSize || 16,
          fontWeight: block.formatting?.bold ? "bold" : "normal",
          fontStyle: block.formatting?.italic ? "italic" : "normal",
        }}
      />
    </div>
  );
};
