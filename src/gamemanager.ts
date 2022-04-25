import {DisplayManager} from "./displaymanager.js";
import {ACard} from "./card.js";
import {PlayerCard} from "./playercard.js";
import {RobotCard} from "./robotplayer.js";
import {
    card_height,
    card_width,
    logger,
    box_width,
    total_cards,
    x_buffer,
    y_buffer, box_height, commodities, commodity_text, max_commodity_count, delay
} from "./utils.js";


export class GameManager {
    d: DisplayManager;
    gameplay_box: ACard;
    inventory_box: ACard;
    cards: PlayerCard[] = [];
    inventory: number[] = [0, 0, 0];
    inventory_box_text: string = "NONE";
    gameplay_box_text: string = "NONE";
    current_player: number = 0;
    current_bid: number = 0;
    current_bidder: number = -1;
    current_commodity: number = -1;
    current_latte_price: number = 3;

    constructor() {
        this.d = new DisplayManager();
        this.gameplay_box = new ACard(this.d);
        this.inventory_box = new ACard(this.d);
        this.setup();
    }

    updateInventory(): void {
        this.inventory_box_text = "Available:\n";
        this.inventory_box_text += commodity_text(this.inventory);
        if (this.current_commodity >= 0) {
            this.inventory_box_text += "\nCurrent Commodity: " + commodities[this.current_commodity];
            this.inventory_box_text += "\nCurrent Bid: " + this.current_bid;
        }
        this.inventory_box.setCardText(this.inventory_box_text);
        this.inventory_box.draw();
    }

    updateGame(): void {
        this.gameplay_box_text = "Actions (P" + (1 + this.current_player) + " - " + this.cards[this.current_player].name + "):";
        for (let i = 0; i < commodities.length; i++) {
            this.gameplay_box_text += "\n" + (i + 1) + ". ";
            if (this.inventory[i] > 0) {
                if (i == this.current_commodity) {
                    this.gameplay_box_text += "Upbid " + commodities[i] + " ($" + (this.current_bid + 1) + ")";
                } else if (-1 == this.current_commodity) {
                    this.gameplay_box_text += "Bid " + commodities[i];
                }
            }
        }

        this.gameplay_box_text += "\n4. Pass (All Pass => Stock+)\n5. Sell Latte (1M 1C 1S)";
        this.gameplay_box_text += "\n\nCurrent Latte Price: $" + this.current_latte_price;
        this.gameplay_box.setCardText(this.gameplay_box_text);
        this.gameplay_box.draw();
    }

    setup(): void {
        this.inventory = [Math.ceil(Math.random() * max_commodity_count), Math.ceil(Math.random() * max_commodity_count), Math.ceil(Math.random() * max_commodity_count)];
        this.gameplay_box.setupCard(0, 0, box_width - x_buffer, box_height - y_buffer, "white", "blue");
        this.inventory_box.setupCard(box_width, 0, box_width - x_buffer, box_height - y_buffer, "white", "red");
        let card_index = 0;
        (this.cards)[card_index] = new PlayerCard(this.d);
        (this.cards)[card_index].setupCard(0, card_height, card_width - x_buffer, card_height - x_buffer, "white", "green");
        card_index++;
        for (let i = 1; i < total_cards; i++) {
            (this.cards)[card_index] = new RobotCard(this.d);
            (this.cards)[card_index].setupCard(i * card_width, card_height, card_width - x_buffer, card_height - x_buffer, "white", "green");
            card_index++;
        }
    }

    showAllCards(): void {
        this.updateGame();
        this.updateInventory();
        for (let i = 0; i < this.cards.length; i++) {
            if (i == this.current_player)
                this.cards[i].active = true;
            else
                this.cards[i].active = false;
            (this.cards)[i].updateCard();
        }
    }

    nextTurn(): void {
        this.current_player = (this.current_player + 1) % this.cards.length;
    }

    makeBid(): void {
        if (this.current_bidder != this.current_player) {
            if (this.current_bid + 1 <= this.cards[this.current_player].money) {
                this.current_bid += 1;
                this.current_bidder = this.current_player;
                this.nextTurn();
            } else {
                logger.message("You don't have enough money to bid that much!");
            }
        } else {
            logger.message("Current high bidder cannot bid: " + this.cards[this.current_player].name);
        }
    }

    doBid(bidID: string): void {
        let bid: number = parseInt(bidID) - 1;
        if (this.inventory[bid] < 1) return;
        if (this.current_commodity == -1 || this.current_commodity == bid) {
            if (bid >= 0 && bid < commodities.length) {
                this.current_commodity = bid;
                this.makeBid();
            }
        }
    }

    doPass(): void {
        this.cards[this.current_player].passed_turn = true;
        this.nextTurn();
    }

    doSell(): void {
        if (this.cards[this.current_player].sellLatte(this.current_latte_price)) {
            this.current_latte_price = Math.ceil(this.current_latte_price * 0.5);
            this.nextTurn();
        }
    }

    doReplaceCommodity(): void {
        // this.inventory[Math.floor(Math.random() * this.inventory.length)] += 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < this.inventory.length; i++) {
            this.inventory[i] += Math.floor(Math.random() * 3);
        }
        this.current_latte_price += 1;
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].money += 1;
        }
    }

    doExecuteSuccessfulBid(): boolean {
        if (!(this.current_bidder >= 0 && this.current_bid > 0)) return false;
        if (this.inventory[this.current_commodity] < 1) return false;
        if (this.cards[this.current_bidder].money < this.current_bid) return false;
        this.cards[this.current_bidder].money -= this.current_bid;
        this.cards[this.current_bidder].inventory[this.current_commodity] += this.inventory[this.current_commodity];
        this.inventory[this.current_commodity] = 0;
        this.current_bid = 1;
        this.current_bidder = -1;
        this.current_commodity = -1;
        return true;
    }


    doRoundCheck(): void {
        let all_passed: boolean = true;
        for (let i = 0; i < this.cards.length; i++) {
            if (!this.cards[i].passed_turn) {
                all_passed = false;
                break;
            }
        }
        if (all_passed) {
            if (this.doExecuteSuccessfulBid()) {
                this.doReplaceCommodity();
                this.doResetRound();
            }
        }
    }

    doResetRound(): void {
        this.current_bid = 0;
        this.current_commodity = -1;
        logger.reset();
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].passed_turn = false;
        }
    }

    validActions(): number[] {
        let actions: number[] = [];
        actions.push(4);
        if (this.current_bidder == -1) {
            for (let i = 0; i < commodities.length; i++) {
                if (this.inventory[i] > 0) {
                    actions.push(i + 1);
                }
            }
        } else if (this.current_bidder != this.current_player) {
            actions.push(this.current_commodity + 1);
        }
        return actions;
    }

    async handleInput(s: string): Promise<void> {
        if (s === "1" || s === "2" || s === "3") {
            this.doBid(s);
        } else if (s === "4") {
            this.doPass();
        } else if (s === "5") {
            this.doSell();
        }
        this.doRoundCheck();
        this.showAllCards();
        while (this.cards[this.current_player].is_robot) {
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.handleInput(this.cards[this.current_player].make_move(this.validActions(), this.inventory, [this.current_latte_price]));
        }
    }

}
