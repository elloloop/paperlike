import React, { useState } from "react";
import { DocumentEditor } from "./DocumentEditor/DocumentEditor";
import type { DocumentState } from "./DocumentEditor/types";

/**
 * Demo component for the DocumentEditor
 * This can be integrated into the main app or used as a standalone demo
 */
export const DocumentEditorDemo: React.FC = () => {
  const [documentState, setDocumentState] = useState<DocumentState | null>(null);

  const handleChange = (state: DocumentState) => {
    setDocumentState(state);
    // You could save to localStorage, send to server, etc.
    console.log("Document state changed:", {
      textBlocksCount: state.textBlocks.length,
      elementsCount: state.excalidrawScene.elements.length,
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <DocumentEditor
        onChange={handleChange}
        theme="light"
      />
    </div>
  );
};
