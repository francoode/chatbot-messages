import { Exclude, Transform } from "class-transformer";
import { PresetMessage } from "../entities/preset-message.model";

export class PresetMessageOptionSerializer {

    constructor(partial: Partial<any>) {
        Object.assign(this, partial);
    }
}