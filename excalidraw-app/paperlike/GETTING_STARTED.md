# Paperlike - Getting Started

## Quick Start

### Running the Development Server

1. **Install dependencies:**
   ```bash
   cd /path/to/paperlike
   yarn install
   ```

2. **Start the development server:**
   ```bash
   yarn --cwd excalidraw-app start
   ```

3. **Access Paperlike:**
   Open your browser and navigate to:
   ```
   http://localhost:3000/paperlike.html
   ```

## Using Paperlike

### Text Editing

**Creating Paragraphs:**
- Type in any text block
- Press `Enter` to create a new paragraph below
- The new paragraph automatically gets focus

**Editing Text:**
- Click on any paragraph to start editing
- Use standard keyboard shortcuts (Cmd/Ctrl+C, V, X, A, Z)
- Text auto-resizes as you type

**Navigation:**
- Tab between text blocks
- Click to focus a specific block
- Arrow keys work within a block

### Drawing

**Basic Drawing:**
1. Use the Excalidraw toolbar on the left
2. Select a drawing tool (rectangle, circle, line, etc.)
3. Draw directly on the canvas
4. Text remains visible on top of drawings

**Drawing Tools:**
- **Selection (V)**: Select and move elements
- **Rectangle (R)**: Draw rectangles
- **Diamond (D)**: Draw diamond shapes
- **Circle (O)**: Draw circles/ellipses
- **Arrow (A)**: Draw arrows
- **Line (L)**: Draw straight lines
- **Freedraw (P)**: Freehand drawing
- **Text (T)**: Add standalone text (not paragraph blocks)
- **Eraser (E)**: Erase drawings

### Combined Workflow

**Example: Document with Diagrams**
1. Type a heading in the first paragraph
2. Press Enter to create a new paragraph
3. Type some body text
4. Press Enter again
5. Select the Rectangle tool from Excalidraw
6. Draw a diagram between the paragraphs
7. Continue typing below the diagram

The text and drawings coexist on the same canvas!

## Document Structure

### What Gets Saved
- All text blocks (content and positioning)
- All Excalidraw elements (shapes, drawings)
- Document metadata (creation time, last modified)

### Document Format
Documents are saved in JSON format:
```json
{
  "version": "1.0.0",
  "textBlocks": [
    {
      "id": "block_xxx",
      "type": "paragraph",
      "content": "Your text here",
      "x": 100,
      "y": 50,
      "height": 24
    }
  ],
  "excalidrawScene": {
    "elements": [...],
    "appState": {...},
    "files": {...}
  },
  "metadata": {
    "created": 1234567890,
    "modified": 1234567890
  }
}
```

## Keyboard Shortcuts

### Text Editing
- `Enter`: Create new paragraph
- `Backspace`: Delete character / merge with previous paragraph (when empty)
- Standard editing: Cmd/Ctrl + C/V/X/A/Z

### Excalidraw Tools
- `V`: Selection tool
- `R`: Rectangle
- `D`: Diamond
- `O`: Circle/Ellipse
- `A`: Arrow
- `L`: Line
- `P`: Pen/Freedraw
- `T`: Text tool
- `E`: Eraser
- `Cmd/Ctrl + Z`: Undo
- `Cmd/Ctrl + Shift + Z`: Redo

## Current Limitations

### MVP Scope
The current implementation is a minimal viable product with:
- ✅ Basic text editing
- ✅ Paragraph creation
- ✅ Drawing integration
- ⏳ No text formatting (bold, italic)
- ⏳ No advanced selection
- ⏳ No save/load (yet)
- ⏳ No export options

### Known Issues
1. **Text Selection**: Text selection is basic (native textarea)
2. **Drawing Between Text**: You can draw, but there's no special "between paragraphs" mode yet
3. **Saving**: Documents are not persisted (will be added soon)
4. **Export**: No export to PDF or image format yet

## Planned Features

### Near Term
- [ ] Save/load documents to browser storage
- [ ] Export to JSON file
- [ ] Basic text formatting (bold, italic)
- [ ] Delete paragraph (Backspace on empty)
- [ ] Better focus management

### Medium Term
- [ ] Smart pointer routing (auto-switch text/draw mode)
- [ ] Export to PDF/PNG
- [ ] Undo/redo for text
- [ ] Copy/paste paragraphs
- [ ] Drag to reorder paragraphs

### Long Term
- [ ] Rich text formatting
- [ ] Lists and indentation
- [ ] Images and embeds
- [ ] Collaboration
- [ ] Templates

## Troubleshooting

### Development Server Won't Start
```bash
# Clean install
yarn rm:node_modules
yarn install
yarn --cwd excalidraw-app start
```

### TypeScript Errors
```bash
# Check types
yarn test:typecheck
```

Note: Some pre-existing errors in the Excalidraw codebase are expected and can be ignored if they don't affect paperlike files.

### Canvas Not Rendering
1. Check browser console for errors
2. Ensure you're on `/paperlike.html` not `/index.html`
3. Try hard refresh (Cmd/Ctrl + Shift + R)

### Text Not Appearing
1. Click on the canvas to focus
2. Check if text layer is visible (should be on top)
3. Verify text color is not white on white background

## Architecture

For detailed architecture information, see:
- `ARCHITECTURE.md` - System design and patterns
- `README.md` - Module documentation
- Source code comments

## Contributing

When working on Paperlike:

1. **Keep changes isolated** - All code in `excalidraw-app/paperlike/`
2. **Don't modify Excalidraw packages** - Use the adapter pattern
3. **Write tests** - For new features and bug fixes
4. **Update docs** - Keep this guide current
5. **Test thoroughly** - Try the dev server before committing

## Getting Help

- Check `README.md` for module details
- Review `ARCHITECTURE.md` for design patterns
- Look at code comments for implementation details
- File issues on GitHub for bugs or feature requests

## Example Workflows

### Creating a Technical Document
1. Start Paperlike
2. Type a title in the first paragraph
3. Press Enter, type introduction
4. Press Enter, select Rectangle tool
5. Draw a system architecture diagram
6. Press Enter (or click below diagram), continue writing
7. Add more diagrams and text as needed

### Sketching Notes with Drawings
1. Start Paperlike
2. Type main ideas as bullet points (one per paragraph)
3. Use Freedraw tool to sketch around text
4. Add arrows to connect concepts
5. Continue adding text and sketches

### Wireframe with Annotations
1. Use Excalidraw tools to draw UI wireframes
2. Add text paragraphs as annotations
3. Position text blocks next to relevant UI elements
4. Export when done (coming soon)

## Next Steps

Now that you're familiar with Paperlike:
1. Try creating a simple document
2. Experiment with mixing text and drawings
3. Check out the architecture docs to understand internals
4. Consider contributing improvements!
