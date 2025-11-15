import type { TextBlock, InteractionMode } from "../types";

/**
 * Determines whether a pointer event should be handled as text editing
 * or drawing based on the pointer position and text block layout.
 */
export function routeInteraction(
  pointerX: number,
  pointerY: number,
  textBlocks: TextBlock[],
  documentWidth: number,
  marginLeft: number,
  marginRight: number,
  marginTop: number,
): InteractionMode {
  // Check if pointer is within a text block's horizontal bounds
  const textAreaLeft = marginLeft;
  const textAreaRight = documentWidth - marginRight;
  const isInTextArea = pointerX >= textAreaLeft && pointerX <= textAreaRight;

  if (!isInTextArea) {
    // Outside text area, always allow drawing
    return "drawing";
  }

  // Check if pointer is within vertical bounds of any text block
  const docY = pointerY;
  const isInTextBlock = textBlocks.some((block) => {
    const blockTop = block.y;
    const blockBottom = block.y + block.height;
    return docY >= blockTop && docY <= blockBottom;
  });

  if (isInTextBlock) {
    // Inside a text block, prefer text editing
    // But allow drawing if user explicitly starts dragging (handled in component)
    return "text";
  }

  // In text area but between blocks, allow drawing
  return "drawing";
}

/**
 * Finds the text block that contains the given Y coordinate
 */
export function findTextBlockAtY(
  y: number,
  textBlocks: TextBlock[],
): TextBlock | null {
  return (
    textBlocks.find((block) => {
      const blockTop = block.y;
      const blockBottom = block.y + block.height;
      return y >= blockTop && y <= blockBottom;
    }) || null
  );
}

/**
 * Finds the insertion point for a new text block after the given Y coordinate
 */
export function findInsertionIndex(
  y: number,
  textBlocks: TextBlock[],
): number {
  for (let i = 0; i < textBlocks.length; i++) {
    if (y < textBlocks[i].y) {
      return i;
    }
  }
  return textBlocks.length;
}
