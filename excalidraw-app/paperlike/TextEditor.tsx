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
  onBackspaceEmpty: (blockId: string) => void;
  onFocus: (blockId: string) => void;
  onBlur: () => void;
  onHeightChange?: (blockId: string, height: number) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  block,
  isActive,
  onContentChange,
  onEnterKey,
  onBackspaceEmpty,
  onFocus,
  onBlur,
  onHeightChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${newHeight}px`;
      
      if (onHeightChange && newHeight !== block.height) {
        onHeightChange(block.id, newHeight);
      }
    }
  }, [block.content, block.id, block.height, onHeightChange]);

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
      } else if (e.key === "Backspace" && block.content === "") {
        e.preventDefault();
        onBackspaceEmpty(block.id);
      }
    },
    [block.id, block.content, onEnterKey, onBackspaceEmpty],
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
        style={{
          fontSize: block.formatting?.fontSize || 16,
          fontWeight: block.formatting?.bold ? "bold" : "normal",
          fontStyle: block.formatting?.italic ? "italic" : "normal",
        }}
      />
    </div>
  );
};
