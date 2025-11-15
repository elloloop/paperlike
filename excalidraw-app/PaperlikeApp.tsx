/**
 * Paperlike App
 * 
 * Main application entry point for the Paperlike document editor.
 */

import { StrictMode } from "react";
import { Provider } from "./app-jotai";
import { PaperlikeEditor } from "./paperlike";
import "./paperlike/PaperlikeEditor.scss";
import "./paperlike/TextEditor.scss";

export const PaperlikeApp = () => {
  return (
    <Provider>
      <PaperlikeEditor />
    </Provider>
  );
};

export default PaperlikeApp;
