/**
 * Document State Management
 * 
 * Manages the state of a Paperlike document, including text blocks
 * and Excalidraw elements.
 */

import { atom } from "jotai";
import type { PaperlikeDocument, TextBlock, DocumentLayout } from "./types";
import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { BinaryFiles } from "@excalidraw/excalidraw/types";

const DOCUMENT_VERSION = "1.0.0";

/**
 * Default layout configuration
 */
export const DEFAULT_LAYOUT: DocumentLayout = {
  leftMargin: 100,
  maxTextWidth: 600,
  paragraphSpacing: 20,
  defaultFontSize: 16,
  lineHeight: 1.5,
};

/**
 * Create an empty Paperlike document
 */
export const createEmptyDocument = (): PaperlikeDocument => ({
  version: DOCUMENT_VERSION,
  textBlocks: [
    {
      id: generateBlockId(),
      type: "paragraph",
      content: "",
      x: DEFAULT_LAYOUT.leftMargin,
      y: 50,
      height: DEFAULT_LAYOUT.defaultFontSize * DEFAULT_LAYOUT.lineHeight,
    },
  ],
  excalidrawScene: {
    elements: [],
    appState: {},
    files: {},
  },
  metadata: {
    created: Date.now(),
    modified: Date.now(),
  },
});

/**
 * Generate a unique block ID
 */
export const generateBlockId = (): string => {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Document state atom
 */
export const documentAtom = atom<PaperlikeDocument>(createEmptyDocument());

/**
 * Layout configuration atom
 */
export const layoutAtom = atom<DocumentLayout>(DEFAULT_LAYOUT);

/**
 * Active text block ID atom
 */
export const activeTextBlockAtom = atom<string | null>(null);

/**
 * Serialize document to JSON
 */
export const serializeDocument = (doc: PaperlikeDocument): string => {
  return JSON.stringify(doc, null, 2);
};

/**
 * Deserialize document from JSON
 */
export const deserializeDocument = (json: string): PaperlikeDocument => {
  const doc = JSON.parse(json) as PaperlikeDocument;
  
  // Validate version compatibility
  if (!doc.version) {
    throw new Error("Invalid document: missing version");
  }
  
  return doc;
};

/**
 * Add a new text block after a given block
 */
export const addTextBlockAfter = (
  doc: PaperlikeDocument,
  afterBlockId: string,
): PaperlikeDocument => {
  const blockIndex = doc.textBlocks.findIndex((b) => b.id === afterBlockId);
  
  if (blockIndex === -1) {
    return doc;
  }
  
  const prevBlock = doc.textBlocks[blockIndex];
  const newY = prevBlock.y + prevBlock.height + DEFAULT_LAYOUT.paragraphSpacing;
  
  const newBlock: TextBlock = {
    id: generateBlockId(),
    type: "paragraph",
    content: "",
    x: DEFAULT_LAYOUT.leftMargin,
    y: newY,
    height: DEFAULT_LAYOUT.defaultFontSize * DEFAULT_LAYOUT.lineHeight,
  };
  
  // Shift subsequent blocks down
  const updatedBlocks = [
    ...doc.textBlocks.slice(0, blockIndex + 1),
    newBlock,
    ...doc.textBlocks.slice(blockIndex + 1).map((block) => ({
      ...block,
      y: block.y + newBlock.height + DEFAULT_LAYOUT.paragraphSpacing,
    })),
  ];
  
  return {
    ...doc,
    textBlocks: updatedBlocks,
    metadata: {
      ...doc.metadata,
      modified: Date.now(),
    },
  };
};

/**
 * Update text block content
 */
export const updateTextBlock = (
  doc: PaperlikeDocument,
  blockId: string,
  content: string,
): PaperlikeDocument => {
  return {
    ...doc,
    textBlocks: doc.textBlocks.map((block) =>
      block.id === blockId ? { ...block, content } : block,
    ),
    metadata: {
      ...doc.metadata,
      modified: Date.now(),
    },
  };
};

/**
 * Update Excalidraw elements
 */
export const updateExcalidrawElements = (
  doc: PaperlikeDocument,
  elements: readonly ExcalidrawElement[],
  files?: BinaryFiles,
): PaperlikeDocument => {
  return {
    ...doc,
    excalidrawScene: {
      ...doc.excalidrawScene,
      elements,
      ...(files && { files }),
    },
    metadata: {
      ...doc.metadata,
      modified: Date.now(),
    },
  };
};
