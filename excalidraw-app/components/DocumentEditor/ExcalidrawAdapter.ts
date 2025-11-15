/**
 * Adapter layer to isolate Excalidraw dependencies.
 * This module provides a clean interface to Excalidraw functionality
 * so that future Excalidraw API changes only require updates here.
 */

import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import type {
  OrderedExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";

export interface ExcalidrawAdapter {
  /**
   * Get the current Excalidraw API instance
   */
  getAPI: () => ExcalidrawImperativeAPI | null;

  /**
   * Update the Excalidraw scene with new elements and app state
   */
  updateScene: (scene: {
    elements?: readonly OrderedExcalidrawElement[];
    appState?: Partial<AppState>;
    files?: BinaryFiles;
  }) => void;

  /**
   * Get current scene elements
   */
  getElements: () => readonly OrderedExcalidrawElement[];

  /**
   * Get current app state
   */
  getAppState: () => AppState;

  /**
   * Get current files
   */
  getFiles: () => BinaryFiles;

  /**
   * Set the active tool in Excalidraw
   */
  setActiveTool: (tool: "freedraw" | "selection" | "text") => void;

  /**
   * Check if Excalidraw is ready
   */
  isReady: () => boolean;
}

/**
 * Creates an Excalidraw adapter instance
 */
export function createExcalidrawAdapter(
  api: ExcalidrawImperativeAPI | null,
): ExcalidrawAdapter {
  return {
    getAPI: () => api,
    updateScene: (scene) => {
      if (api) {
        api.updateScene(scene);
      }
    },
    getElements: () => {
      if (api) {
        return api.getSceneElementsIncludingDeleted();
      }
      return [];
    },
    getAppState: () => {
      if (api) {
        return api.getAppState();
      }
      // Return default app state if API not available
      throw new Error("Excalidraw API not available");
    },
    getFiles: () => {
      if (api) {
        return api.getFiles();
      }
      return {};
    },
    setActiveTool: (tool) => {
      if (api) {
        const appState = api.getAppState();
        api.updateScene({
          appState: {
            activeTool: {
              type: tool,
              customType: null,
            },
          },
        });
      }
    },
    isReady: () => api !== null,
  };
}
