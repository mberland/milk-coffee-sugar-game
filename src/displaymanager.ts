import {dimensions, Patch, x_buffer} from "./utils.js"
import {Display} from "../lib/index.js"

// import {KEYS} from "../lib/constants.js"


export class DisplayManager {
    d: Display;
    PatchChar: string[] = [" ", "#", "."];

    constructor() {
        this.d = new Display(dimensions);
        let div = document.createElement("div");
        div.id = "rot";
        document.body.appendChild(div);
        div.appendChild(this.d.getContainer());
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

    drawTextInBox(text: string, x: number, y: number, width: number, height: number, fg: string): void {
        let row_window = height - 2 * x_buffer;
        let col_window = width - 2 * x_buffer;
        let cc = 0;
        for (let row = 0; row < row_window; row++) {
            for (let col = 0; col < col_window; col++) {
                let c = text[cc];
                cc += 1;
                if (c == "\n") {
                    break;
                }
                this.draw(x + x_buffer + col, y + x_buffer + row, c, fg, "black");
            }
        }
    }

    eventToPosition(e: TouchEvent | MouseEvent): [number, number] {
        return this.d.eventToPosition(e);
    }
}
