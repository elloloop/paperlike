/**
 * PaperlikeEditor Component
 * 
 * Main component that integrates text editing with Excalidraw drawing.
 */

import React, { useCallback, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useAtom } from "jotai";
import {
  documentAtom,
  addTextBlockAfter,
  updateTextBlock,
  updateExcalidrawElements,
  DEFAULT_LAYOUT,
} from "./documentState";
import { TextEditor } from "./TextEditor";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/element/types";
import "./PaperlikeEditor.scss";

export const PaperlikeEditor: React.FC = () => {
  const [document, setDocument] = useAtom(documentAtom);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI | null>(null);

  const handleContentChange = useCallback(
    (blockId: string, content: string) => {
      setDocument((doc) => updateTextBlock(doc, blockId, content));
    },
    [setDocument],
  );

  const handleHeightChange = useCallback(
    (blockId: string, newHeight: number) => {
      setDocument((doc) => {
        const blockIndex = doc.textBlocks.findIndex((b) => b.id === blockId);
        if (blockIndex === -1) return doc;

        const heightDiff = newHeight - doc.textBlocks[blockIndex].height;
        if (Math.abs(heightDiff) < 1) return doc; // Ignore tiny changes

        return {
          ...doc,
          textBlocks: doc.textBlocks.map((block, idx) => {
            if (idx === blockIndex) {
              return { ...block, height: newHeight };
            } else if (idx > blockIndex) {
              return { ...block, y: block.y + heightDiff };
            }
            return block;
          }),
          metadata: {
            ...doc.metadata,
            modified: Date.now(),
          },
        };
      });
    },
    [setDocument],
  );

  const handleEnterKey = useCallback(
    (blockId: string) => {
      setDocument((doc) => {
        const newDoc = addTextBlockAfter(doc, blockId);
        // Focus the new block
        const blockIndex = doc.textBlocks.findIndex((b) => b.id === blockId);
        if (blockIndex !== -1 && newDoc.textBlocks[blockIndex + 1]) {
          setTimeout(() => {
            setActiveBlockId(newDoc.textBlocks[blockIndex + 1].id);
          }, 0);
        }
        return newDoc;
      });
    },
    [setDocument],
  );

  const handleFocus = useCallback((blockId: string) => {
    setActiveBlockId(blockId);
  }, []);

  const handleBlur = useCallback(() => {
    // Don't immediately clear active block to allow for smooth transitions
    setTimeout(() => setActiveBlockId(null), 100);
  }, []);

  const handleExcalidrawChange = useCallback(
    (elements: readonly ExcalidrawElement[]) => {
      setDocument((doc) => updateExcalidrawElements(doc, elements));
    },
    [setDocument],
  );

  return (
    <div className="paperlike-editor">
      <div className="paperlike-canvas-container">
        <Excalidraw
          excalidrawAPI={(api: ExcalidrawImperativeAPI) => {
            excalidrawAPIRef.current = api;
          }}
          initialData={{
            elements: document.excalidrawScene.elements,
            appState: {
              ...document.excalidrawScene.appState,
              viewBackgroundColor: "#ffffff",
            },
            files: document.excalidrawScene.files,
          }}
          onChange={(elements) => {
            handleExcalidrawChange(elements);
          }}
          UIOptions={{
            canvasActions: {
              loadScene: false,
              export: { saveFileToDisk: true },
              clearCanvas: false,
            },
          }}
        />
        
        <div className="paperlike-text-layer">
          {document.textBlocks.map((block) => (
            <TextEditor
              key={block.id}
              block={block}
              isActive={activeBlockId === block.id}
              onContentChange={handleContentChange}
              onEnterKey={handleEnterKey}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onHeightChange={handleHeightChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
