import {DisplayManager} from "./displaymanager.js";
import {ACard} from "./card.js";
import {PlayerCard} from "./playercard.js";
import {RobotCard} from "./robotplayer.js";
import {
    box_height,
    box_width,
    box_y,
    button_height,
    button_width,
    button_y,
    card_height,
    card_width,
    card_y,
    commodities,
    commodity_text,
    help_height,
    help_width,
    help_y,
    lattes_to_win,
    logger,
    max_commodity_count,
    newlineAString,
    total_cards
} from "./utils.js";
import {ButtonCard} from "./buttoncard.js";


export class GameManager {
    d: DisplayManager;
    gameplay_box: ACard;
    inventory_box: ACard;
    help_box: ACard;
    cards: PlayerCard[] = [];
    inventory: number[] = [0, 0, 0];
    inventory_box_text: string = "NONE";
    gameplay_box_text: string = "NONE";
    help_box_text: string = "Welcome to Milk Coffee Sugar\nby Asher (age 12) & Matthew Berland";
    current_player: number = 0;
    current_bid: number = 0;
    current_bidder: number = -1;
    current_commodity: number = -1;
    current_latte_price: number = 3;
    current_options: string[] = [];
    buttons: ButtonCard[] = [];
    private game_over: boolean;
    private winner: string;
    protected most_cash_player: number = -1;
    protected most_cash: number = -1;

    constructor() {
        this.d = new DisplayManager();

        this.gameplay_box = new ACard(this.d);
        this.inventory_box = new ACard(this.d);
        this.help_box = new ACard(this.d);
        this.setup();
    }

    help_box_default_text(): string {
        let text = "You can bid on a commodity, pass, or sell lattes.\n";
        text += "Making a latte takes one of each commodity.\n";
        text += "Winner: Most $ when someone sells their " + lattes_to_win + "th latte!";
        return text;
    }

    updateInventory(): void {
        this.inventory_box_text = "Available:\n";
        this.inventory_box_text += commodity_text(this.inventory);
        if (this.current_commodity >= 0) {
            this.inventory_box_text += "\nCurrent Commodity: " + commodities[this.current_commodity];
            this.inventory_box_text += "\nCurrent Bid: " + this.current_bid;
            this.inventory_box_text += "\nCurrent Bidder: " + this.cards[this.current_bidder].name;
        }
        // if (this.most_cash_player >= 0) {
        //     this.inventory_box_text += "\nCurrent $ Leader: " + this.cards[this.most_cash_player].name;
        // }
        this.inventory_box.setCardText(this.inventory_box_text);
        this.inventory_box.draw(false);
    }

    updateGame(): void {
        this.current_options = [];
        this.gameplay_box_text = "Actions (P" + (1 + this.current_player) + " - " + this.cards[this.current_player].name + "):";
        for (let i = 0; i < commodities.length; i++) {
            this.gameplay_box_text += "\n" + (i + 1) + ". ";
            if (this.inventory[i] > 0) {
                let option_text = "";
                if (i == this.current_commodity) {
                    option_text = "Upbid " + commodities[i] + " ($" + (this.current_bid + 1) + ")";
                    this.gameplay_box_text += option_text;
                } else if (-1 == this.current_commodity) {
                    option_text = "Bid " + commodities[i];
                    this.gameplay_box_text += option_text;
                }
                this.current_options.push(option_text);
            } else {
                this.current_options.push("");
            }
        }

        this.gameplay_box_text += "\n4. Pass (Stock+/Round)";
        this.current_options.push("Pass");

        if (this.cards[this.current_player].canSell()) {
            this.gameplay_box_text += "\n5. Sell Latte (1M 1C 1S)";
            this.current_options.push("Sell Latte");
        } else {
            this.gameplay_box_text += "\n5.";
            this.current_options.push("");
        }

        this.gameplay_box_text += "\n\nCurrent Latte Price: $" + this.current_latte_price;
        this.gameplay_box.setCardText(this.gameplay_box_text);
        this.gameplay_box.draw(false);
    }

    setup(): void {
        this.inventory = [Math.ceil(Math.random() * max_commodity_count), Math.ceil(Math.random() * max_commodity_count), Math.ceil(Math.random() * max_commodity_count)];
        this.gameplay_box.setupCard(0, box_y, box_width, box_height, "white", "blue");
        this.inventory_box.setupCard(box_width, box_y, box_width, box_height, "white", "red");
        let card_index = 0;
        (this.cards)[card_index] = new PlayerCard(this.d);
        (this.cards)[card_index].setupCard(0, card_y, card_width, card_height, "white", "green");
        card_index++;
        for (let i = 1; i < total_cards; i++) {
            (this.cards)[card_index] = new RobotCard(this.d);
            (this.cards)[card_index].setupCard(i * card_width,
                card_y, card_width, card_height,
                "white", "green");
            card_index++;
        }
        for (let i = 0; i < 5; i++) {
            (this.buttons)[i] = new ButtonCard(this.d);
            (this.buttons)[i].setupCard(i * button_width,
                button_y, button_width, button_height,
                "white", "yellow");
        }
        this.help_box.setupCard(0, help_y, help_width, help_height, "white", "white");
        this.help_box.setCardText(this.help_box_default_text());
    }

    showAllCards(): void {
        this.updateGame();
        this.updateInventory();
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].active = i == this.current_player;
            (this.cards)[i].updateCard();
        }
        for (let i = 0; i < this.buttons.length; i++) {
            (this.buttons)[i].setCardText(newlineAString(this.current_options[i]));
            (this.buttons)[i].choiceNumber = 1 + i;
            (this.buttons)[i].draw();
        }
        this.help_box.setCardText(this.help_box_text);
        this.help_box.draw();
    }

    nextTurn(): void {
        this.current_player = (this.current_player + 1) % this.cards.length;
        this.help_box_text = this.help_box_default_text();
    }

    makeBid(): void {
        if (this.current_bidder != this.current_player) {
            if (this.current_bid + 1 <= this.cards[this.current_player].money) {
                this.current_bid += 1;
                this.current_bidder = this.current_player;
                this.nextTurn();
            } else {
                this.help_box_text = "You don't have enough money to bid that much!";
            }
        } else {
            this.help_box_text = "Current high bidder cannot bid: " + this.cards[this.current_player].name;
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


    doWinCheck(): boolean {
        this.most_cash = -1;
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].money > this.most_cash) {
                this.most_cash = this.cards[i].money;
                this.most_cash_player = i;
            }
        }
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].total_lattes_sold >= lattes_to_win) {
                this.game_over = true;
                this.winner = this.cards[this.most_cash_player].name;
                return this.game_over;
            }
        }
        return this.game_over;
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
        } else if (this.current_bidder != this.current_player && !this.cards[this.current_player].passed_turn) {
            actions.push(this.current_commodity + 1);
        }
        return actions;
    }

    handleClick(e: MouseEvent | TouchEvent) {
        let x: number;
        let y: number;
        [x, y] = this.d.eventToPosition(e);
        for (let i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].contains(x, y)) {
                this.handleInput("" + this.buttons[i].choiceNumber).then(_ => {
                });
            }
        }
    }

    async handleInput(s: string): Promise<void> {
        // logger.log("Player " + (this.current_player + 1) + ": " + s);
        if (this.doWinCheck()) {
            this.help_box_text = "Game over!!\n" + this.winner + " wins!";
            this.showAllCards();
            return;
        }
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
