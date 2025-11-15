# Document Editor

A rich text document editor built on top of Excalidraw that allows users to type text and draw directly in a document, similar to Google Docs or Medium.

## Features

- **Text Editing**: Type and edit text in left-aligned paragraphs
- **Inline Drawing**: Draw directly in the document without switching modes
- **Coordinate Mapping**: Text and drawings are properly aligned on the same surface
- **Event Routing**: Automatically routes interactions between text editing and drawing
- **Adapter Layer**: Isolated Excalidraw dependencies for easy upgrades

## Usage

### Access the Document Editor

Add `?mode=document` to the URL to access the document editor:

```
http://localhost:3000?mode=document
```

### Using the Component

```tsx
import { DocumentEditor } from "./components/DocumentEditor";

function MyApp() {
  const handleChange = (state: DocumentState) => {
    // Handle document state changes
    console.log("Text blocks:", state.textBlocks);
    console.log("Excalidraw elements:", state.excalidrawScene.elements);
  };

  return (
    <DocumentEditor
      onChange={handleChange}
      theme="light"
      width={1200}
      height={800}
    />
  );
}
```

## Architecture

### Components

- **DocumentEditor**: Main component that wraps Excalidraw and manages text blocks
- **TextBlockEditor**: Individual text block editor component
- **ExcalidrawAdapter**: Adapter layer to isolate Excalidraw dependencies

### Utilities

- **coordinateMapper**: Maps between document coordinates and Excalidraw canvas coordinates
- **eventRouter**: Routes pointer events to text editing or drawing
- **textLayout**: Manages text block layout and positioning

### State Management

The document state combines:
- `textBlocks`: Array of text paragraphs
- `excalidrawScene`: Excalidraw elements, app state, and files
- Layout metadata: document width, margins

## How It Works

1. **Text Blocks**: Text is stored as separate blocks with positions and content
2. **Coordinate Mapping**: Document Y coordinates are mapped to Excalidraw canvas coordinates accounting for zoom and scroll
3. **Event Routing**: Pointer events are analyzed to determine if the user wants to edit text or draw
4. **Overlay Rendering**: Text blocks are rendered as an overlay on top of the Excalidraw canvas

## Limitations & Future Improvements

- Text formatting (bold, italic, etc.) is not yet implemented
- Text blocks use simple line wrapping (not full text layout engine)
- Drawing coordinates may need refinement for perfect alignment
- No export functionality for the combined document yet

## Upgrading Excalidraw

The adapter layer (`ExcalidrawAdapter.ts`) isolates Excalidraw dependencies. When upgrading Excalidraw:

1. Check if any API methods used in `ExcalidrawAdapter` have changed
2. Update the adapter methods to match the new API
3. Test coordinate mapping and event routing

Most changes should be isolated to the adapter layer.
