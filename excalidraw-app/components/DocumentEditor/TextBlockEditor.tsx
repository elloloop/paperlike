import React, { useRef, useEffect, useState } from "react";
import type { TextBlock } from "./types";
import { updateTextBlockContent } from "./utils/textLayout";

interface TextBlockEditorProps {
  block: TextBlock;
  isFocused: boolean;
  onContentChange: (blockId: string, content: string) => void;
  onKeyDown: (event: React.KeyboardEvent, blockId: string) => void;
  onBlur: () => void;
  style?: React.CSSProperties;
}

/**
 * A simple text block editor component that renders a contenteditable div
 */
export const TextBlockEditor: React.FC<TextBlockEditorProps> = ({
  block,
  isFocused,
  onContentChange,
  onKeyDown,
  onBlur,
  style,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [localContent, setLocalContent] = useState(block.content);

  // Sync with block content when it changes externally
  useEffect(() => {
    if (block.content !== localContent && editorRef.current) {
      editorRef.current.textContent = block.content;
      setLocalContent(block.content);
    }
  }, [block.content]);

  // Focus management
  useEffect(() => {
    if (isFocused && editorRef.current) {
      editorRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isFocused]);

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    const newContent = event.currentTarget.textContent || "";
    setLocalContent(newContent);
    onContentChange(block.id, newContent);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown(event, block.id);
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
      style={{
        position: "absolute",
        left: "0px",
        top: `${block.y}px`,
        width: `${block.width}px`,
        minHeight: `${block.height}px`,
        fontSize: `${block.fontSize}px`,
        lineHeight: block.lineHeight,
        outline: "none",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#000",
        backgroundColor: isFocused ? "transparent" : "transparent",
        ...style,
      }}
      data-block-id={block.id}
    />
  );
};
