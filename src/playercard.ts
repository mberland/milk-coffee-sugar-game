import {ACard} from "./card.js";
import {DisplayManager} from "./displaymanager.js";
import {commodity_text, random_name} from "./utils.js";

// import {logger} from "./utils.js";

export class PlayerCard extends ACard {
    inventory: number[]; // milk, coffee, sugar
    public money: number;
    public name: string;
    public passed_turn: boolean;
    public is_robot: boolean = false;
    public total_lattes_sold: number = 0;

    constructor(d: DisplayManager) {
        super(d);
        this.inventory = [0, 0, 0];
        this.money = 10;
        this.name = random_name();
        this.passed_turn = false;
    }

    updateCardText(): void {
        let cardText: string = "";
        cardText += "Name: " + this.name + "\n";
        cardText += "Money: $" + this.money + "\n";
        cardText += "Inventory:\n" + commodity_text(this.inventory);
        cardText += "\nLattes sold: " + this.total_lattes_sold + "\n";
        cardText += "Passed: " + this.passed_turn.toString().toUpperCase();
        this.setCardText(cardText);
    }

    sellLatte(current_price: number): boolean {
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i] < 1) {
                return false;
            }
        }
        this.money += current_price;
        for (let i = 0; i < this.inventory.length; i++) {
            this.inventory[i] -= 1;
        }
        this.total_lattes_sold += 1;
        return true;
    }

    make_move(valid_actions: number[], current_available: number[], current_prices: number[]): string {
        return "UNKNOWN";
    }

    updateCard(): void {
        this.updateCardText();
        this.draw();
    }
}
