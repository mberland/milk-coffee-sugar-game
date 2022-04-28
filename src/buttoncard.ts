import {PlayerCard} from "./playercard.js";
import {DisplayManager} from "./displaymanager.js";

export class ButtonCard extends PlayerCard {
    public choiceNumber: number;

    constructor(d: DisplayManager) {
        super(d);
        this.name = "BUTTON";
        this.choiceNumber = -1;
    }

}
