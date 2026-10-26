import { mergeCells, splitAll, splitCell } from "../src/index";

const MAX = 6;
const picker = document.querySelector<HTMLDivElement>("#size-picker")!;
const sizeLabel = document.querySelector<HTMLOutputElement>("#size-label")!;
const table = document.querySelector<HTMLTableElement>("#layout")!;
const status = document.querySelector<HTMLParagraphElement>("#status")!;

function buildTable(rows: number, cols: number): void {
  table.replaceChildren();
  for (let r = 0; r < rows; r++) {
    const row = table.insertRow();
    for (let c = 0; c < cols; c++) {
      const cell = row.insertCell();
      cell.textContent = `${r + 1}.${c + 1}`;
    }
  }
  sizeLabel.value = `${rows} × ${cols}`;
  status.textContent = "";
}

function highlight(rows: number, cols: number): void {
  for (const bit of picker.children as HTMLCollectionOf<HTMLButtonElement>) {
    const on = Number(bit.dataset.row) <= rows && Number(bit.dataset.col) <= cols;
    bit.classList.toggle("on", on);
  }
}

for (let r = 1; r <= MAX; r++) {
  for (let c = 1; c <= MAX; c++) {
    const bit = document.createElement("button");
    bit.type = "button";
    bit.dataset.row = String(r);
    bit.dataset.col = String(c);
    bit.ariaLabel = `${r} rows, ${c} columns`;
    bit.addEventListener("pointerenter", () => highlight(r, c));
    bit.addEventListener("click", () => buildTable(r, c));
    picker.append(bit);
  }
}

table.addEventListener("click", (event) => {
  const cell = (event.target as Element).closest("td");
  cell?.classList.toggle("selected");
});

document.querySelector("#merge")!.addEventListener("click", () => {
  const merged = mergeCells(table);
  status.textContent = merged ? `Merged ${merged} cell(s).` : "Nothing to merge.";
});

document.querySelector("#split")!.addEventListener("click", () => {
  let restored = 0;
  for (const cell of table.querySelectorAll<HTMLTableCellElement>("td.selected")) {
    restored += splitCell(cell);
    cell.classList.remove("selected");
  }
  status.textContent = `Restored ${restored} cell(s).`;
});

document.querySelector("#split-all")!.addEventListener("click", () => {
  status.textContent = `Restored ${splitAll(table)} cell(s).`;
});

document.querySelector("#clear")!.addEventListener("click", () => {
  for (const cell of table.querySelectorAll("td.selected")) cell.classList.remove("selected");
});

buildTable(3, 4);
highlight(3, 4);
