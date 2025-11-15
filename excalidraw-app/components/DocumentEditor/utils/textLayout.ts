import type { TextBlock } from "../types";

const DEFAULT_FONT_SIZE = 16;
const DEFAULT_LINE_HEIGHT = 1.5;
const DEFAULT_PARAGRAPH_SPACING = 12;

/**
 * Calculates the height of a text block based on its content
 */
export function calculateTextBlockHeight(
  content: string,
  fontSize: number = DEFAULT_FONT_SIZE,
  lineHeight: number = DEFAULT_LINE_HEIGHT,
  width: number,
): number {
  if (!content.trim()) {
    // Empty block has minimum height
    return fontSize * lineHeight;
  }

  // Simple line wrapping calculation
  // Approximate character width (monospace approximation)
  const avgCharWidth = fontSize * 0.6;
  const charsPerLine = Math.floor(width / avgCharWidth);
  const lines = Math.max(1, Math.ceil(content.length / charsPerLine));
  return lines * fontSize * lineHeight;
}

/**
 * Creates a new empty text block
 */
export function createTextBlock(
  id: string,
  y: number,
  width: number,
  fontSize: number = DEFAULT_FONT_SIZE,
  lineHeight: number = DEFAULT_LINE_HEIGHT,
): TextBlock {
  return {
    id,
    content: "",
    y,
    height: calculateTextBlockHeight("", fontSize, lineHeight, width),
    width,
    fontSize,
    lineHeight,
  };
}

/**
 * Updates text block positions after a block is inserted or removed
 */
export function updateTextBlockPositions(
  textBlocks: TextBlock[],
  startIndex: number = 0,
  paragraphSpacing: number = DEFAULT_PARAGRAPH_SPACING,
): TextBlock[] {
  if (textBlocks.length === 0) {
    return [];
  }

  const updated = [...textBlocks];
  let currentY = textBlocks[0]?.y || 0;

  for (let i = startIndex; i < updated.length; i++) {
    if (i > 0) {
      // Add spacing after previous block
      currentY = updated[i - 1].y + updated[i - 1].height + paragraphSpacing;
    }
    updated[i] = {
      ...updated[i],
      y: currentY,
      height: calculateTextBlockHeight(
        updated[i].content,
        updated[i].fontSize,
        updated[i].lineHeight,
        updated[i].width,
      ),
    };
  }

  return updated;
}

/**
 * Inserts a new text block at the specified index
 */
export function insertTextBlock(
  textBlocks: TextBlock[],
  index: number,
  block: TextBlock,
  paragraphSpacing: number = DEFAULT_PARAGRAPH_SPACING,
): TextBlock[] {
  const updated = [...textBlocks];
  updated.splice(index, 0, block);
  return updateTextBlockPositions(updated, index, paragraphSpacing);
}

/**
 * Removes a text block at the specified index
 */
export function removeTextBlock(
  textBlocks: TextBlock[],
  index: number,
  paragraphSpacing: number = DEFAULT_PARAGRAPH_SPACING,
): TextBlock[] {
  const updated = [...textBlocks];
  updated.splice(index, 1);
  return updateTextBlockPositions(updated, Math.max(0, index - 1), paragraphSpacing);
}

/**
 * Updates a text block's content and recalculates its height
 */
export function updateTextBlockContent(
  textBlocks: TextBlock[],
  blockId: string,
  content: string,
  paragraphSpacing: number = DEFAULT_PARAGRAPH_SPACING,
): TextBlock[] {
  const index = textBlocks.findIndex((b) => b.id === blockId);
  if (index === -1) {
    return textBlocks;
  }

  const updated = [...textBlocks];
  updated[index] = {
    ...updated[index],
    content,
    height: calculateTextBlockHeight(
      content,
      updated[index].fontSize,
      updated[index].lineHeight,
      updated[index].width,
    ),
  };

  return updateTextBlockPositions(updated, index, paragraphSpacing);
}
