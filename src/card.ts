import * as utils from "./utils.js";
import {DisplayManager} from "./displaymanager.js";
import {alphabet, card_fg_active, card_fg_inactive} from "./utils.js";


export class ACard {
    protected d: DisplayManager;
    protected fg_active: string = card_fg_active;
    protected fg_inactive: string = card_fg_inactive;
    bg: string = "black";
    protected card_text: string = alphabet;
    cx: number = utils.BAD_NUMBER;
    cy: number = utils.BAD_NUMBER;
    protected width: number = utils.BAD_NUMBER;
    protected height: number = utils.BAD_NUMBER;
    protected is_created: boolean = false;
    public active: boolean = true;

    constructor(display: DisplayManager) {
        this.d = display;
    }

    private getFG(): string {
        if (this.active)
            return this.fg_active;
        else
            return this.fg_inactive;
    }

    draw(): void {
        if (!this.is_created) {
            return;
        }
        this.d.drawBox(this.cx, this.cy, this.width, this.height, this.bg);
        this.d.drawTextInBox(this.card_text, this.cx, this.cy, this.width, this.height, this.getFG());
    }

    setupCard(x: number, y: number, width: number, height: number, fg: string, bg: string): void {
        this.cx = x;
        this.cy = y;
        this.height = height;
        this.width = width;
        this.fg_active = fg;
        this.bg = bg;
        this.is_created = true;
        // logger.log("card created: ");
    }

    setCardText(text: string): void {
        this.card_text = text;
    }
}
