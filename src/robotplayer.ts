import {PlayerCard} from "./playercard.js";
import {DisplayManager} from "./displaymanager.js";
import {random_name} from "./utils.js";

export class RobotCard extends PlayerCard {
    constructor(d: DisplayManager) {
        super(d);
        this.is_robot = true;
        this.name = random_name();
    }

    can_sell(): boolean {
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i] < 1) {
                return false;
            }
        }
        return true;
    }

    make_move(valid_actions: number[], current_available: number[], current_prices: number[]): string {
        // don't sell when below 2
        // don't bid above $2/item
        if (this.can_sell() && current_prices[0] > 2) {
            return "5";
        }
        return valid_actions[Math.floor(Math.random() * valid_actions.length)].toString();
    }
}
