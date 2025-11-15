import type {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";

/**
 * A text block represents a paragraph in the document.
 * Text blocks are stored separately from Excalidraw elements.
 */
export interface TextBlock {
  id: string;
  content: string;
  /**
   * Y position in document coordinates (pixels from top of document)
   */
  y: number;
  /**
   * Height of the text block in pixels
   */
  height: number;
  /**
   * Width of the text block (typically document width minus margins)
   */
  width: number;
  /**
   * Font size in pixels
   */
  fontSize: number;
  /**
   * Line height as a multiplier (e.g., 1.5)
   */
  lineHeight: number;
}

/**
 * Document state combines text blocks with Excalidraw scene data
 */
export interface DocumentState {
  textBlocks: TextBlock[];
  excalidrawScene: {
    elements: readonly OrderedExcalidrawElement[];
    appState: Partial<AppState>;
    files: BinaryFiles;
  };
  /**
   * Document width in pixels (for text layout)
   */
  documentWidth: number;
  /**
   * Left margin in pixels
   */
  marginLeft: number;
  /**
   * Top margin in pixels
   */
  marginTop: number;
  /**
   * Right margin in pixels
   */
  marginRight: number;
}

/**
 * Coordinate transformation utilities
 */
export interface CoordinateMapper {
  /**
   * Convert document Y coordinate to Excalidraw canvas Y coordinate
   */
  documentToCanvasY: (docY: number) => number;
  /**
   * Convert Excalidraw canvas Y coordinate to document Y coordinate
   */
  canvasToDocumentY: (canvasY: number) => number;
  /**
   * Convert document X coordinate to Excalidraw canvas X coordinate
   */
  documentToCanvasX: (docX: number) => number;
  /**
   * Convert Excalidraw canvas X coordinate to document X coordinate
   */
  canvasToDocumentX: (canvasX: number) => number;
}

/**
 * Event routing decision
 */
export type InteractionMode = "text" | "drawing" | "unknown";
