import type { AppState } from "@excalidraw/excalidraw/types";
import type { CoordinateMapper } from "../types";

/**
 * Creates a coordinate mapper that translates between document coordinates
 * (used for text layout) and Excalidraw canvas coordinates.
 */
export function createCoordinateMapper(
  appState: AppState,
  marginLeft: number,
  marginTop: number,
): CoordinateMapper {
  return {
    documentToCanvasY: (docY: number) => {
      // Document Y is relative to top of document
      // Canvas Y needs to account for scroll and zoom
      return (docY + marginTop) * appState.zoom.value + appState.scrollY;
    },
    canvasToDocumentY: (canvasY: number) => {
      // Reverse the transformation
      return (canvasY - appState.scrollY) / appState.zoom.value - marginTop;
    },
    documentToCanvasX: (docX: number) => {
      return (docX + marginLeft) * appState.zoom.value + appState.scrollX;
    },
    canvasToDocumentX: (canvasX: number) => {
      return (canvasX - appState.scrollX) / appState.zoom.value - marginLeft;
    },
  };
}
