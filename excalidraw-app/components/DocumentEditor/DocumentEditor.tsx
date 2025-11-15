import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import type {
  OrderedExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import { nanoid } from "nanoid";

import type { DocumentState, TextBlock, InteractionMode } from "./types";
import {
  routeInteraction,
  findTextBlockAtY,
  findInsertionIndex,
} from "./utils/eventRouter";
import {
  createTextBlock,
  insertTextBlock,
  removeTextBlock,
  updateTextBlockContent,
  updateTextBlockPositions,
} from "./utils/textLayout";
import { createExcalidrawAdapter } from "./ExcalidrawAdapter";
import { TextBlockEditor } from "./TextBlockEditor";

interface DocumentEditorProps {
  initialData?: ExcalidrawInitialDataState | null;
  onChange?: (state: DocumentState) => void;
  theme?: "light" | "dark";
  width?: number;
  height?: number;
}

const DEFAULT_DOCUMENT_WIDTH = 800;
const DEFAULT_MARGIN_LEFT = 80;
const DEFAULT_MARGIN_TOP = 40;
const DEFAULT_MARGIN_RIGHT = 80;
const DEFAULT_FONT_SIZE = 16;

/**
 * DocumentEditor - A rich text document editor on top of Excalidraw
 * that allows typing text and drawing directly in the document.
 */
export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialData,
  onChange,
  theme = "light",
  width,
  height,
}) => {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("unknown");

  const containerRef = useRef<HTMLDivElement>(null);
  const excalidrawAdapter = useMemo(
    () => createExcalidrawAdapter(excalidrawAPI),
    [excalidrawAPI],
  );

  // Initialize with an empty text block if no blocks exist
  useEffect(() => {
    if (textBlocks.length === 0 && excalidrawAdapter.isReady()) {
      const appState = excalidrawAdapter.getAppState();
      const documentWidth =
        width || DEFAULT_DOCUMENT_WIDTH - DEFAULT_MARGIN_LEFT - DEFAULT_MARGIN_RIGHT;
      const initialBlock = createTextBlock(
        nanoid(),
        DEFAULT_MARGIN_TOP,
        documentWidth,
        DEFAULT_FONT_SIZE,
      );
      setTextBlocks([initialBlock]);
      setFocusedBlockId(initialBlock.id);
    }
  }, [textBlocks.length, excalidrawAdapter, width]);

  // Track app state for coordinate calculations
  const [appState, setAppState] = useState<AppState | null>(null);

  // Handle Excalidraw changes
  const handleExcalidrawChange = useCallback(
    (
      elements: readonly OrderedExcalidrawElement[],
      newAppState: AppState,
      files: BinaryFiles,
    ) => {
      // Update app state for coordinate calculations
      setAppState(newAppState);

      // Notify parent of document state change
      if (onChange) {
        onChange({
          textBlocks,
          excalidrawScene: {
            elements,
            appState: newAppState,
            files,
          },
          documentWidth: width || DEFAULT_DOCUMENT_WIDTH,
          marginLeft: DEFAULT_MARGIN_LEFT,
          marginTop: DEFAULT_MARGIN_TOP,
          marginRight: DEFAULT_MARGIN_RIGHT,
        });
      }
    },
    [textBlocks, onChange, width],
  );

  // Update app state when Excalidraw API becomes available
  useEffect(() => {
    if (excalidrawAdapter.isReady()) {
      setAppState(excalidrawAdapter.getAppState());
    }
  }, [excalidrawAdapter]);

  // Handle text block content change
  const handleTextBlockContentChange = useCallback(
    (blockId: string, content: string) => {
      setTextBlocks((blocks) =>
        updateTextBlockContent(blocks, blockId, content),
      );
    },
    [],
  );

  // Handle text block key events
  const handleTextBlockKeyDown = useCallback(
    (event: React.KeyboardEvent, blockId: string) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const blockIndex = textBlocks.findIndex((b) => b.id === blockId);
        if (blockIndex !== -1) {
          const currentBlock = textBlocks[blockIndex];
          const documentWidth =
            width || DEFAULT_DOCUMENT_WIDTH - DEFAULT_MARGIN_LEFT - DEFAULT_MARGIN_RIGHT;
          const newBlock = createTextBlock(
            nanoid(),
            currentBlock.y + currentBlock.height,
            documentWidth,
            DEFAULT_FONT_SIZE,
          );
          setTextBlocks((blocks) => insertTextBlock(blocks, blockIndex + 1, newBlock));
          setFocusedBlockId(newBlock.id);
        }
      } else if (event.key === "Backspace") {
        const blockIndex = textBlocks.findIndex((b) => b.id === blockId);
        const currentBlock = textBlocks[blockIndex];
        // If block is empty and not the only block, remove it
        if (
          currentBlock &&
          !currentBlock.content.trim() &&
          textBlocks.length > 1
        ) {
          event.preventDefault();
          setTextBlocks((blocks) => removeTextBlock(blocks, blockIndex));
          // Focus previous block
          if (blockIndex > 0) {
            setFocusedBlockId(textBlocks[blockIndex - 1].id);
          } else if (textBlocks.length > 1) {
            setFocusedBlockId(textBlocks[1].id);
          }
        }
      }
    },
    [textBlocks, width],
  );

  // Handle pointer events to route between text and drawing
  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (!excalidrawAdapter.isReady() || !appState) {
        return;
      }

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      // Get pointer position relative to container
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;

      // Convert to document coordinates
      // Account for scroll and zoom
      const docX = (pointerX - appState.scrollX) / appState.zoom.value - DEFAULT_MARGIN_LEFT;
      const docY = (pointerY - appState.scrollY) / appState.zoom.value - DEFAULT_MARGIN_TOP;

      const documentWidth =
        width || DEFAULT_DOCUMENT_WIDTH - DEFAULT_MARGIN_LEFT - DEFAULT_MARGIN_RIGHT;

      // Route the interaction
      const mode = routeInteraction(
        docX,
        docY,
        textBlocks,
        documentWidth,
        DEFAULT_MARGIN_LEFT,
        DEFAULT_MARGIN_RIGHT,
        DEFAULT_MARGIN_TOP,
      );

      setInteractionMode(mode);

      if (mode === "text") {
        // Find the text block and focus it
        const block = findTextBlockAtY(docY, textBlocks);
        if (block) {
          setFocusedBlockId(block.id);
        } else {
          // Create new block at this position
          const index = findInsertionIndex(docY, textBlocks);
          const newBlock = createTextBlock(
            nanoid(),
            docY,
            documentWidth,
            DEFAULT_FONT_SIZE,
          );
          setTextBlocks((blocks) => insertTextBlock(blocks, index, newBlock));
          setFocusedBlockId(newBlock.id);
        }
        setIsDrawing(false);
      } else {
        // Switch to drawing mode
        setIsDrawing(true);
        setFocusedBlockId(null);
        excalidrawAdapter.setActiveTool("freedraw");
      }
    },
    [
      excalidrawAdapter,
      appState,
      textBlocks,
      width,
    ],
  );

  // Handle pointer move to detect drawing
  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (isDrawing && event.buttons === 1) {
        // User is actively drawing
        setInteractionMode("drawing");
      }
    },
    [isDrawing],
  );

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Calculate text area style
  const textAreaStyle: React.CSSProperties = useMemo(() => {
    if (!appState) {
      return { display: "none" };
    }

    return {
      position: "absolute",
      left: `${DEFAULT_MARGIN_LEFT * appState.zoom.value + appState.scrollX}px`,
      top: `${DEFAULT_MARGIN_TOP * appState.zoom.value + appState.scrollY}px`,
      width: `${
        (width || DEFAULT_DOCUMENT_WIDTH - DEFAULT_MARGIN_LEFT - DEFAULT_MARGIN_RIGHT) *
        appState.zoom.value
      }px`,
      pointerEvents: interactionMode === "text" ? "auto" : "none",
      zIndex: 10,
      transform: `scale(${appState.zoom.value})`,
      transformOrigin: "top left",
    };
  }, [appState, width, interactionMode]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: width || "100%",
        height: height || "100%",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleExcalidrawChange}
        initialData={initialData}
        theme={theme}
        UIOptions={{
          canvasActions: {
            // Hide some UI elements for a cleaner doc-like experience
            toggleTheme: true,
            export: true,
          },
        }}
        detectScroll={true}
        handleKeyboardGlobally={false}
        autoFocus={false}
      />
      {/* Text blocks overlay */}
      {excalidrawAdapter.isReady() && appState && (
        <div style={textAreaStyle}>
          {textBlocks.map((block) => (
            <TextBlockEditor
              key={block.id}
              block={block}
              isFocused={focusedBlockId === block.id}
              onContentChange={handleTextBlockContentChange}
              onKeyDown={handleTextBlockKeyDown}
              onBlur={() => {
                // Keep focus if user is still interacting with text
                if (interactionMode !== "drawing") {
                  // Focus will be managed by pointer events
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
