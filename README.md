# Table Merger

Merge and split cells of an HTML table, like the table tool in a word processor. Only rectangles
merge. For example, a dashboard can let its users build their own layout from a grid.

- TypeScript, ES modules, no dependencies (about 1.5 kB)
- `mergeCells`, `splitCell` and `splitAll`
- Works with any `<table>` that is a full grid

**[Live demo](https://velovsky.github.io/js-table-merger/)**

## Install

```bash
npm install github:velovsky/js-table-merger
```

The package builds itself on install (`prepare`). Without a bundler, load
`dist/table-merger.iife.js` with a `<script>` tag; it exposes a global `TableMerger`.

## Usage

Mark the cells to merge with the `selected` class, then call `mergeCells`:

```ts
import { mergeCells, splitCell, splitAll } from "js-table-merger";

const table = document.querySelector("table")!;

table.addEventListener("click", (event) => {
  (event.target as Element).closest("td")?.classList.toggle("selected");
});

mergeCells(table); // or mergeCells("#layout")
mergeCells(table, { selectedClass: "to-merge" }); // a custom class

splitCell(table.rows[0].cells[0]); // split one merged cell
splitAll(table); // split every merged cell
```

## API

| Function                                 | Returns                                        |
| ---------------------------------------- | ---------------------------------------------- |
| `mergeCells(target, { selectedClass? })` | The number of cells merged into another cell.  |
| `splitCell(cell)`                        | The number of cells that became visible again. |
| `splitAll(target)`                       | The number of cells that became visible again. |

`target` is an `HTMLTableElement` or a CSS selector. An unknown target throws a `TypeError`.

### How it works

The table must be a full grid: one cell per row and column. A merge grows the first cell with
`colSpan` / `rowSpan` and gives the cells it covers the `hidden` attribute, so they stay in the
DOM. This keeps `cell.cellIndex` equal to the cell's column, and a split only has to show the
covered cells again. Selected cells that cannot form a rectangle with a neighbour (for example
the corner of an L shape) keep their selection.

## Development

```bash
npm install
npm run dev        # demo with hot reload
npm test           # Vitest + jsdom
npm run lint && npm run typecheck
npm run build      # dist/ (ES module, IIFE, types)
```

## Changes in 2.0

Version 1 (2018) was a jQuery plugin. Version 2 is a rewrite:

- No jQuery. TypeScript with ES modules and type declarations.
- `table_merger("#id", "class")` is now `mergeCells("#id", { selectedClass: "class" })`.
- Covered cells use the `hidden` attribute, so the old `td.hidden` CSS rule is not needed.
- New: `splitCell` and `splitAll`.
- Fixed: the old function wrote `cell_class` and `table_id` to `window`.

## License

MIT
