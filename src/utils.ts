// import {Display} from "../lib/index.js";

// export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

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

export const dimensions = {width: 70, height: 30};
export const total_cards: number = 3;
export const max_commodity_count = 3;
export const box_width: number = Math.floor(dimensions.width / 2);
export const box_height: number = Math.floor(dimensions.height / 2);
export const card_width: number = Math.floor(dimensions.width / total_cards);
export const card_height: number = Math.floor(dimensions.height / 2);
export const x_buffer: number = 2;
export const y_buffer: number = 1;
export const alphabet = "abcdefghijklmnopqrstuvqxyz";
export const consonants = "bcdfghjklmnpqrstvwxyz";
export const vowels = "aeiou";
export const card_fg_active: string = "white";
export const card_fg_inactive: string = "#555555";
// export const card_bg: string = "goldenrod";

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

// export enum PatchType {Empty, Wall, Floor}

// export class Patch {
//
//     private readonly _p_type: PatchType;
//
//     constructor(p: PatchType) {this._p_type = p;}
//
//     stringify(): string {
//         return this.patchString(this._p_type);
//     }
//
//     patchString(p_type: PatchType): string {
//         switch (p_type) {
//             case PatchType.Empty: return ' ';
//             case PatchType.Wall: return '#';
//             case PatchType.Floor: return '.';
//         }
//     }
// }
