/**
 * table-merger: merge and split cells of an HTML table, like the table tool in a word processor.
 *
 * The table must be a full grid: one <td>/<th> per row and column. Merged cells grow with
 * colSpan/rowSpan and the cells they cover stay in the DOM with the `hidden` attribute, so a
 * cell's `cellIndex` is always its column.
 */

export type TableTarget = HTMLTableElement | string;

export interface MergeOptions {
  /** Class that marks the cells to merge. Default: `"selected"`. */
  selectedClass?: string;
}

const DEFAULT_SELECTED_CLASS = "selected";

function resolveTable(target: TableTarget): HTMLTableElement {
  const element = typeof target === "string" ? document.querySelector(target) : target;
  if (!(element instanceof HTMLTableElement)) {
    throw new TypeError(`table-merger: no <table> found for ${String(target)}`);
  }
  return element;
}

function isSelected(cell: HTMLTableCellElement, selectedClass: string): boolean {
  return !cell.hidden && cell.classList.contains(selectedClass);
}

function cover(cell: HTMLTableCellElement, selectedClass: string): void {
  cell.classList.remove(selectedClass);
  cell.hidden = true;
  cell.rowSpan = 1;
  cell.colSpan = 1;
}

function mergeHorizontally(table: HTMLTableElement, selectedClass: string): number {
  let merges = 0;
  for (const row of table.rows) {
    const selected = [...row.cells].filter((cell) => isSelected(cell, selectedClass));
    let current = selected[0];
    for (const next of selected.slice(1)) {
      const adjacent = current.cellIndex + current.colSpan === next.cellIndex;
      if (adjacent && current.rowSpan === next.rowSpan) {
        current.colSpan += next.colSpan;
        cover(next, selectedClass);
        merges++;
      } else {
        current = next;
      }
    }
  }
  return merges;
}

function mergeVertically(table: HTMLTableElement, selectedClass: string): number {
  let merges = 0;
  const rows = table.rows;
  for (let r = 0; r < rows.length; r++) {
    for (const cell of rows[r].cells) {
      if (!isSelected(cell, selectedClass)) continue;
      let below = rows[r + cell.rowSpan]?.cells[cell.cellIndex];
      while (below && isSelected(below, selectedClass) && below.colSpan === cell.colSpan) {
        cell.rowSpan += below.rowSpan;
        cover(below, selectedClass);
        merges++;
        below = rows[r + cell.rowSpan]?.cells[cell.cellIndex];
      }
    }
  }
  return merges;
}

/**
 * Merges the selected cells of a table into rectangles.
 * Selected cells that cannot form a rectangle with a neighbour stay as they are.
 *
 * @returns the number of cells that were merged into another cell.
 */
export function mergeCells(target: TableTarget, options: MergeOptions = {}): number {
  const table = resolveTable(target);
  const selectedClass = options.selectedClass ?? DEFAULT_SELECTED_CLASS;

  let total = 0;
  let merged: number;
  do {
    merged = mergeHorizontally(table, selectedClass) + mergeVertically(table, selectedClass);
    total += merged;
  } while (merged > 0);
  return total;
}

/**
 * Splits a merged cell back into single cells.
 *
 * @returns the number of cells that became visible again.
 */
export function splitCell(cell: HTMLTableCellElement): number {
  const row = cell.parentElement;
  const table = cell.closest("table");
  if (!(row instanceof HTMLTableRowElement) || !table) {
    throw new TypeError("table-merger: the cell is not inside a table row");
  }

  let restored = 0;
  for (let dr = 0; dr < cell.rowSpan; dr++) {
    for (let dc = 0; dc < cell.colSpan; dc++) {
      const covered = table.rows[row.rowIndex + dr]?.cells[cell.cellIndex + dc];
      if (covered && covered !== cell && covered.hidden) {
        covered.hidden = false;
        restored++;
      }
    }
  }
  cell.rowSpan = 1;
  cell.colSpan = 1;
  return restored;
}

/**
 * Splits every merged cell in the table.
 *
 * @returns the number of cells that became visible again.
 */
export function splitAll(target: TableTarget): number {
  const table = resolveTable(target);
  let restored = 0;
  for (const row of table.rows) {
    for (const cell of row.cells) {
      if (!cell.hidden && (cell.rowSpan > 1 || cell.colSpan > 1)) restored += splitCell(cell);
    }
  }
  return restored;
}
