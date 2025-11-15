# Paperlike Document Editor

A rich text document editor built on top of Excalidraw with inline freehand drawing capabilities.

## Overview

Paperlike provides a familiar document editing experience similar to Google Docs or Medium, while allowing users to draw directly on the canvas without switching modes. It's designed as a thin layer on top of Excalidraw to make it easy to pull in upstream changes.

## Architecture

### Core Components

- **DocumentState** (`documentState.ts`): Manages the combined document state including text blocks and Excalidraw elements
- **PaperlikeEditor** (`PaperlikeEditor.tsx`): Main editor component that integrates text and drawing
- **TextEditor** (`TextEditor.tsx`): Handles individual text block editing

### Document Model

The document structure (`PaperlikeDocument`) contains:
- `textBlocks`: Array of text paragraphs with positioning
- `excalidrawScene`: Standard Excalidraw scene data (elements, appState, files)
- `metadata`: Creation and modification timestamps
- `version`: Schema version for future compatibility

### Layout System

- Text is always left-aligned at a fixed margin (default: 100px)
- Maximum text width is constrained (default: 600px)
- Paragraphs are vertically spaced with automatic layout
- Drawing elements share the same coordinate system

## Features

### Text Editing
- ✅ Left-aligned, single-column layout
- ✅ Paragraph blocks with Enter key support
- ✅ Basic text input and editing
- ⏳ Copy/paste support (planned)
- ⏳ Basic formatting (bold, italic) (planned)

### Drawing
- ✅ Embedded Excalidraw component for drawing
- ✅ Drawing tools available in toolbar
- ⏳ Seamless drawing between paragraphs (enhancement needed)
- ⏳ Automatic pointer event routing (enhancement needed)

### Integration
- ✅ Isolated adapter layer for Excalidraw dependencies
- ✅ Versioned document format
- ✅ Serialization/deserialization
- ⏳ Easy upgrade path for Excalidraw updates (to be validated)

## Usage

### Running Paperlike

```bash
# From the repository root
yarn install
yarn build:packages
yarn --cwd excalidraw-app dev
```

Then navigate to `/paperlike.html` to see the Paperlike editor.

### Document Format

```typescript
{
  version: "1.0.0",
  textBlocks: [
    {
      id: "block_123",
      type: "paragraph",
      content: "Hello world",
      x: 100,
      y: 50,
      height: 24
    }
  ],
  excalidrawScene: {
    elements: [...],
    appState: {...},
    files: {...}
  },
  metadata: {
    created: 1234567890,
    modified: 1234567890
  }
}
```

## Development Plan

See the main issue for the complete implementation roadmap. Current status:

**Phase 1 (In Progress)**: Core architecture and basic text editing
**Phase 2 (Planned)**: Enhanced drawing integration and pointer routing
**Phase 3 (Planned)**: Advanced features and polish

## Extensibility

The architecture is designed to be extensible:

1. **Document Model**: Easy to add new block types or formatting options
2. **Adapter Layer**: Isolated dependencies on Excalidraw internals
3. **Layout System**: Configurable through `DocumentLayout` interface
4. **Event Routing**: Prepared for advanced pointer handling logic

## Testing

```bash
# Run tests
yarn test:app

# Type checking
yarn test:typecheck

# Build
yarn build:packages
```

## Contributing

When contributing to Paperlike:

1. Keep changes isolated to the `paperlike/` directory when possible
2. Maintain the adapter pattern for Excalidraw integration
3. Follow existing code style and TypeScript conventions
4. Update this README with new features or changes

## License

Same as the parent Excalidraw project (MIT).
