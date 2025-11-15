# Paperlike Architecture

## Overview

Paperlike is a document editor that combines rich text editing with Excalidraw's drawing capabilities. The goal is to provide a Google Docs-like writing experience while allowing users to draw directly on the document without mode switching.

## Design Principles

### 1. Minimal Modification Philosophy
- **Zero changes to Excalidraw packages**: All custom code is isolated in `excalidraw-app/paperlike/`
- **Thin wrapper approach**: Paperlike is a layer on top of Excalidraw, not a fork
- **Easy upgrades**: Excalidraw can be upgraded with minimal integration work

### 2. Adapter Pattern
All interactions with Excalidraw are channeled through a well-defined interface:
- State management adapters (Jotai atoms)
- Component wrappers (PaperlikeEditor)
- Type definitions that extend Excalidraw types

### 3. Coordinate System Unity
Text blocks and drawing elements share the same canvas coordinate space:
- Text blocks have absolute x, y positions in canvas coordinates
- Drawings use native Excalidraw coordinates
- Layout system manages text positioning to avoid conflicts

## Core Components

### Document Model (`types.ts`)

```typescript
interface PaperlikeDocument {
  version: string;              // Schema versioning
  textBlocks: TextBlock[];      // Paragraph content
  excalidrawScene: {            // Native Excalidraw data
    elements: ExcalidrawElement[];
    appState: Partial<AppState>;
    files: BinaryFiles;
  };
  metadata: {
    created: number;
    modified: number;
  };
}
```

**Key Design Decisions:**
- Text blocks are separate from Excalidraw elements for clean separation
- Version field enables schema migrations
- Metadata supports future features (autosave, conflict resolution)

### State Management (`documentState.ts`)

Uses Jotai for reactive state:
- `documentAtom`: The entire document state
- `layoutAtom`: Layout configuration
- `activeTextBlockAtom`: Currently focused text block

**Rationale:**
- Jotai is already used in Excalidraw app
- Atomic updates prevent race conditions
- Enables easy state debugging and time travel

### Text Editor (`TextEditor.tsx`)

A lightweight textarea-based editor for each paragraph:
- Positioned absolutely on canvas
- Minimal styling for Google Docs feel
- Focus management for block navigation

**Why not ProseMirror/Slate?**
- Start simple, add complexity only when needed
- Native textarea provides good UX for MVP
- Can be swapped later without changing architecture

### Main Editor (`PaperlikeEditor.tsx`)

Orchestrates text and drawing:
```
┌─────────────────────────────────────┐
│  PaperlikeEditor                    │
│  ┌───────────────────────────────┐  │
│  │  Excalidraw Component         │  │
│  │  (Drawing surface)            │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  Text Layer (absolute)        │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ TextEditor (block 1)    │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ TextEditor (block 2)    │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Event Flow

### Text Input Flow
1. User types in TextEditor
2. `onContentChange` updates document via Jotai atom
3. React re-renders with new content
4. Metadata updated with modification timestamp

### Drawing Flow
1. User draws on Excalidraw canvas
2. `onChange` callback updates document
3. Elements stored in `excalidrawScene.elements`
4. Text layer remains on top (z-index management)

### Enter Key (New Paragraph)
1. `onEnterKey` in TextEditor
2. `addTextBlockAfter` creates new block below current
3. All subsequent blocks shift down
4. New block auto-focused

## Layout Algorithm

**Vertical Layout:**
```
Block 1: y = 50
         height = 24
Block 2: y = 50 + 24 + 20 (spacing) = 94
         height = 48
Block 3: y = 94 + 48 + 20 = 162
```

**Horizontal Layout:**
```
All text: x = 100 (leftMargin)
          maxWidth = 600
```

This creates a consistent, left-aligned column.

## Future Enhancements

### Phase 1: Smart Pointer Routing
- Detect pointer position relative to text blocks
- Route to text editing when over text
- Route to drawing when in empty space
- Support "draw between paragraphs" interaction

### Phase 2: Advanced Layout
- Dynamic text height based on content
- Text wrapping and line breaks
- Paragraph formatting (indents, spacing)
- Multiple columns (future)

### Phase 3: Rich Text Features
- Bold, italic, underline
- Fonts and sizes
- Lists and indentation
- Copy/paste with formatting

### Phase 4: Integration
- Save/load documents (.paperlike format)
- Export to PDF, PNG
- Collaboration support
- Version history

## Excalidraw Integration Points

### Dependencies Used
- `@excalidraw/excalidraw` - Main component
- `@excalidraw/element/types` - Element types
- Types: `ExcalidrawElement`, `AppState`, `BinaryFiles`

### API Surface
```typescript
// Component props
<Excalidraw
  excalidrawAPI={(api) => {...}}
  initialData={{elements, appState, files}}
  onChange={(elements) => {...}}
  UIOptions={{...}}
/>

// State sync
document.excalidrawScene.elements -> Excalidraw
Excalidraw onChange -> document.excalidrawScene.elements
```

### Isolation Strategy
All Excalidraw imports are in:
- `PaperlikeEditor.tsx` (main integration)
- `types.ts` (type definitions)
- `documentState.ts` (state management)

This means:
- Easy to mock for testing
- Clear upgrade boundaries
- Can swap Excalidraw for alternatives

## Upgrade Path

When upgrading Excalidraw:

1. **Check type compatibility**
   ```bash
   yarn test:typecheck
   ```

2. **Update integration points**
   - Review changes to `ExcalidrawProps`
   - Update `ExcalidrawElement` usage if schema changed
   - Test `onChange` callback behavior

3. **Test key scenarios**
   - Create text blocks
   - Draw shapes
   - Enter key for new paragraphs
   - Save/load document

4. **Update version**
   - Bump `PaperlikeDocument.version` if schema changed
   - Add migration logic in `deserializeDocument`

## Testing Strategy

### Unit Tests
- Document state operations (add block, update content)
- Serialization/deserialization
- Layout calculations

### Integration Tests
- Text editing flow
- Drawing integration
- Enter key behavior
- Focus management

### E2E Tests
- Create multi-paragraph document
- Draw between paragraphs
- Save and reload
- Export document

## Performance Considerations

### Current
- Minimal overhead (simple state management)
- React re-renders only on changes
- Excalidraw handles its own optimization

### Future Optimizations
- Virtual scrolling for many blocks
- Debounced state updates
- Lazy loading of images
- Progressive rendering

## Security & Privacy

- No server communication (local-first)
- Documents stored in browser storage
- Excalidraw's encryption for collaboration
- No external dependencies beyond Excalidraw

## Accessibility

### Current
- Keyboard navigation (Tab, Enter)
- Focus indicators
- Semantic HTML (textarea)

### Future
- ARIA labels
- Screen reader support
- Keyboard shortcuts
- High contrast mode

## Conclusion

Paperlike's architecture prioritizes:
1. **Simplicity** - Start with minimal viable implementation
2. **Isolation** - Keep Excalidraw integration clean
3. **Extensibility** - Easy to add features later
4. **Maintainability** - Clear boundaries and documentation

This foundation enables rapid iteration while maintaining code quality and upgrade compatibility.
