import {dimensions, Patch} from "./utils.js"
import {Display} from "../lib/index.js"

// import {KEYS} from "../lib/constants.js"


export class DisplayManager {
    d: Display;
    PatchChar: string[] = [" ", "#", "."];
    protected _ctx: HTMLCanvasElement;

    constructor() {
        this.d = new Display(dimensions);
        this._ctx = this.d.getContainer() as HTMLCanvasElement;
        document.body.appendChild(this.d.getContainer());
    }

    draw(x: number, y: number, c: string, fg: string, bg: string): void {
        this.d.draw(x, y, c, fg, bg);
    }

    drawBox(x: number, y: number, width: number, height: number, fg: string): void {
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                let c = (this.PatchChar)[Patch.Empty];
                if (row == 0 && col == 0) {
                    c = "╔";
                } else if (row == 0 && col == width - 1) {
                    c = "╗";
                } else if (row == height - 1 && col == 0) {
                    c = "╚";
                } else if (row == height - 1 && col == width - 1) {
                    c = "╝";
                } else if (row == 0 || row == height - 1) {
                    c = "═";
                } else if (col == 0 || col == width - 1) {
                    c = "║";
                }

                this.draw(x + col, y + row, c, fg, "black");
            }
        }
    }

    drawTextInBox(text: string, x: number, y: number, width: number, height: number, fg: string, vcenter: boolean = true): void {
        let row_window = height - 2;
        let col_window = width - 2;
        let cc = 0;
        let start_row = 0;
        if (vcenter) {
            let total_rows = text.split("\n").length;
            start_row = Math.floor((row_window - total_rows) / 2);
        }
        for (let row = start_row; row < row_window; row++) {
            for (let col = 0; col < col_window; col++) {
                let c = text[cc];
                cc += 1;
                if (c == "\n") {
                    break;
                }
                this.draw(x + col + 1, y + row + 1, c, fg, "black");
            }
        }
    }

    eventToPosition(e: TouchEvent | MouseEvent): [number, number] {
        return this.d.eventToPosition(e);
    }
}
