import { beforeEach, describe, expect, it } from "vitest";
import { mergeCells, splitAll, splitCell } from "./index";

/** Builds a rows×cols grid; `selected` lists "r,c" coordinates to mark. */
function grid(rows: number, cols: number, selected: string[] = []): HTMLTableElement {
  const table = document.createElement("table");
  for (let r = 0; r < rows; r++) {
    const row = table.insertRow();
    for (let c = 0; c < cols; c++) {
      const cell = row.insertCell();
      cell.textContent = `${r},${c}`;
      if (selected.includes(`${r},${c}`)) cell.classList.add("selected");
    }
  }
  document.body.append(table);
  return table;
}

/** Visible cells as "text:rowSpan×colSpan". */
function layout(table: HTMLTableElement): string[] {
  return [...table.querySelectorAll("td")]
    .filter((cell) => !cell.hidden)
    .map((cell) => `${cell.textContent}:${cell.rowSpan}x${cell.colSpan}`);
}

beforeEach(() => {
  document.body.replaceChildren();
});

describe("mergeCells", () => {
  it("merges a horizontal run", () => {
    const table = grid(1, 4, ["0,0", "0,1", "0,2"]);
    expect(mergeCells(table)).toBe(2);
    expect(layout(table)).toEqual(["0,0:1x3", "0,3:1x1"]);
  });

  it("merges a vertical run", () => {
    const table = grid(3, 1, ["0,0", "1,0", "2,0"]);
    expect(mergeCells(table)).toBe(2);
    expect(layout(table)).toEqual(["0,0:3x1"]);
  });

  it("merges a 2x2 block into one cell", () => {
    const table = grid(3, 3, ["0,1", "0,2", "1,1", "1,2"]);
    expect(mergeCells(table)).toBe(3);
    expect(table.rows[0].cells[1].rowSpan).toBe(2);
    expect(table.rows[0].cells[1].colSpan).toBe(2);
    expect(table.querySelectorAll("td[hidden]")).toHaveLength(3);
  });

  it("does not merge cells that are not adjacent", () => {
    const table = grid(1, 3, ["0,0", "0,2"]);
    expect(mergeCells(table)).toBe(0);
    expect(layout(table)).toEqual(["0,0:1x1", "0,1:1x1", "0,2:1x1"]);
  });

  it("keeps an L shape as a rectangle plus a single cell", () => {
    const table = grid(2, 2, ["0,0", "0,1", "1,0"]);
    expect(mergeCells(table)).toBe(1);
    expect(layout(table)).toEqual(["0,0:1x2", "1,0:1x1", "1,1:1x1"]);
    expect(table.rows[1].cells[0].classList.contains("selected")).toBe(true);
  });

  it("merges a merged cell with a new neighbour of the same height", () => {
    const table = grid(2, 3, ["0,0", "1,0"]);
    mergeCells(table);
    table.rows[0].cells[0].classList.add("selected");
    table.rows[0].cells[1].classList.add("selected");
    table.rows[1].cells[1].classList.add("selected");

    mergeCells(table);
    expect(table.rows[0].cells[0].rowSpan).toBe(2);
    expect(table.rows[0].cells[0].colSpan).toBe(2);
  });

  it("uses a custom class and accepts a selector", () => {
    const table = grid(1, 2);
    table.id = "dashboard";
    for (const cell of table.rows[0].cells) cell.classList.add("to-merge");

    expect(mergeCells("#dashboard", { selectedClass: "to-merge" })).toBe(1);
    expect(table.rows[0].cells[0].colSpan).toBe(2);
  });

  it("throws when the target is not a table", () => {
    expect(() => mergeCells("#missing")).toThrow(TypeError);
  });

  it("does not leak globals", () => {
    mergeCells(grid(1, 2, ["0,0", "0,1"]));
    expect("cell_class" in window).toBe(false);
    expect("table_id" in window).toBe(false);
  });
});

describe("splitCell", () => {
  it("restores the covered cells", () => {
    const table = grid(2, 2, ["0,0", "0,1", "1,0", "1,1"]);
    mergeCells(table);

    expect(splitCell(table.rows[0].cells[0])).toBe(3);
    expect(layout(table)).toEqual(["0,0:1x1", "0,1:1x1", "1,0:1x1", "1,1:1x1"]);
  });

  it("does nothing for a single cell", () => {
    const table = grid(1, 2);
    expect(splitCell(table.rows[0].cells[0])).toBe(0);
  });
});

describe("splitAll", () => {
  it("splits every merged cell", () => {
    const table = grid(3, 3, ["0,0", "0,1", "2,1", "2,2"]);
    mergeCells(table);

    expect(splitAll(table)).toBe(2);
    expect(table.querySelectorAll("td[hidden]")).toHaveLength(0);
  });
});
