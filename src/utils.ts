import {LogManager} from "./logmanager.js";

export const BAD_NUMBER = -28768;

export const commodities: string[] = ["Milk", "Coffee", "Sugar"];

export function commodity_text(inventory: number[]) {
    let text = "";
    for (let i = 0; i < commodities.length; i++) {
        text += inventory[i] + " " + commodities[i] + "\n";
    }
    return text;
}

export enum Patch {Empty, Wall, Floor}

export const total_cards: number = 3;
export const total_buttons: number = 5;
export const total_info: number = 2;
const x_dimension_multiplier: number = 2;
const y_dimension_multiplier: number = 8;
export const even_width: number = x_dimension_multiplier * total_cards * total_buttons * total_info;
export const even_height: number = y_dimension_multiplier * 6; // 6 rows
export const dimensions = {width: even_width, height: even_height};
export const info_area_dimensions = {width: dimensions.width, height: Math.floor(dimensions.height / 3)};
export const card_area_dimensions = {width: dimensions.width, height: info_area_dimensions.height};
export const button_area_dimensions = {width: dimensions.width, height: Math.floor(dimensions.height / 6)};
export const help_area_dimensions = {width: dimensions.width, height: button_area_dimensions.height};
// export const x_buffer: number = 1;
// export const y_buffer: number = 0;
export const max_commodity_count = 3;
export const box_width: number = Math.floor(info_area_dimensions.width / 2);
export const box_height: number = info_area_dimensions.height;
export const card_width: number = Math.floor(card_area_dimensions.width / total_cards);
export const card_height: number = card_area_dimensions.height;
export const button_width: number = Math.floor(card_width * total_cards / 5);
export const button_height: number = button_area_dimensions.height;
export const help_width: number = dimensions.width;
export const help_height: number = help_area_dimensions.height;


export const box_y: number = 0;
export const card_y: number = box_y + box_height;
export const button_y: number = card_y + card_height;
export const help_y: number = button_y + button_height;

export const lattes_to_win: number = 5;
export const alphabet = "abcdefghijklmnopqrstuvqxyz";
export const consonants = "bcdfghjklmnpqrstvwxyz";
export const vowels = "aeiou";
export const card_fg_active: string = "white";
export const card_fg_inactive: string = "#555555";

export const logger: LogManager = new LogManager();

export function random_name(): string {
    let name: string = "";
    for (let nw = 0; nw < 2; nw++) {
        if (nw != 0) {
            name += " ";
        }
        name += consonants[Math.floor(Math.random() * consonants.length)].toUpperCase();
        name += vowels[Math.floor(Math.random() * vowels.length)];
        for (let i = 0; i < Math.ceil(Math.random() * 2); i++) {
            if (Math.random() < 0.4) {
                name += vowels[Math.floor(Math.random() * vowels.length)];
            } else {
                name += consonants[Math.floor(Math.random() * consonants.length)];
            }
        }
    }
    return name;
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function newlineAString(s: string): string {
    return s.replace(/ /g, "\n");
}
