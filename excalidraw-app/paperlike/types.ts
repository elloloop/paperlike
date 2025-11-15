/**
 * Paperlike Document Model
 * 
 * This file defines the core data structures for the Paperlike document editor,
 * which combines rich text blocks with Excalidraw drawing elements.
 */

import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";

/**
 * A single text block in the document (paragraph)
 */
export interface TextBlock {
  id: string;
  type: "paragraph";
  content: string;
  // Position in document (y-coordinate on canvas)
  y: number;
  // Height of the text block
  height: number;
  // Left margin (always aligned to same x position)
  x: number;
  // Formatting options
  formatting?: {
    bold?: boolean;
    italic?: boolean;
    fontSize?: number;
  };
}

/**
 * Complete Paperlike document structure
 */
export interface PaperlikeDocument {
  version: string;
  textBlocks: TextBlock[];
  excalidrawScene: {
    elements: readonly ExcalidrawElement[];
    appState: Partial<AppState>;
    files: BinaryFiles;
  };
  metadata: {
    created: number;
    modified: number;
  };
}

/**
 * Layout configuration for the document
 */
export interface DocumentLayout {
  // Left margin for text (in canvas coordinates)
  leftMargin: number;
  // Maximum width for text column
  maxTextWidth: number;
  // Vertical spacing between paragraphs
  paragraphSpacing: number;
  // Default font size
  defaultFontSize: number;
  // Line height multiplier
  lineHeight: number;
}

/**
 * Interaction mode for the editor
 */
export type EditorMode = "text" | "draw";

/**
 * Pointer event context for routing
 */
export interface PointerEventContext {
  mode: EditorMode;
  activeTextBlock: string | null;
  pointerPosition: { x: number; y: number };
}
