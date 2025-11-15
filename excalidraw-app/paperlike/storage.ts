/**
 * Storage utilities for persisting Paperlike documents
 */

import type { PaperlikeDocument } from "./types";
import { serializeDocument, deserializeDocument } from "./documentState";

const STORAGE_KEY = "paperlike_document";
const AUTOSAVE_KEY = "paperlike_autosave";

/**
 * Save document to localStorage
 */
export const saveDocument = (doc: PaperlikeDocument): void => {
  try {
    const json = serializeDocument(doc);
    localStorage.setItem(STORAGE_KEY, json);
    console.log("Document saved successfully");
  } catch (error) {
    console.error("Failed to save document:", error);
    throw error;
  }
};

/**
 * Load document from localStorage
 */
export const loadDocument = (): PaperlikeDocument | null => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      return null;
    }
    return deserializeDocument(json);
  } catch (error) {
    console.error("Failed to load document:", error);
    return null;
  }
};

/**
 * Auto-save document
 */
export const autoSaveDocument = (doc: PaperlikeDocument): void => {
  try {
    const json = serializeDocument(doc);
    localStorage.setItem(AUTOSAVE_KEY, json);
  } catch (error) {
    console.error("Failed to auto-save document:", error);
  }
};

/**
 * Load auto-saved document
 */
export const loadAutoSave = (): PaperlikeDocument | null => {
  try {
    const json = localStorage.getItem(AUTOSAVE_KEY);
    if (!json) {
      return null;
    }
    return deserializeDocument(json);
  } catch (error) {
    console.error("Failed to load auto-saved document:", error);
    return null;
  }
};

/**
 * Clear auto-save
 */
export const clearAutoSave = (): void => {
  localStorage.removeItem(AUTOSAVE_KEY);
};

/**
 * Export document as downloadable JSON file
 */
export const exportDocument = (doc: PaperlikeDocument, filename?: string): void => {
  const json = serializeDocument(doc);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `paperlike_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import document from file
 */
export const importDocument = (file: File): Promise<PaperlikeDocument> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const doc = deserializeDocument(json);
        resolve(doc);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Check if there's a saved document
 */
export const hasSavedDocument = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

/**
 * Check if there's an auto-saved document
 */
export const hasAutoSave = (): boolean => {
  return localStorage.getItem(AUTOSAVE_KEY) !== null;
};

/**
 * Clear all saved documents
 */
export const clearAllDocuments = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(AUTOSAVE_KEY);
};
