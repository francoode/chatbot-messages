import { Exclude, Transform } from "class-transformer";
import { PresetMessageOption } from "../entities/preset-options.model";
import { PresetMessage } from "../entities/preset-message.model";

export class PresetMessageOptionSerializer {

    @Transform(({ value }) => value.id)
    presetMessageDisplay: PresetMessage;

    constructor(partial: Partial<PresetMessageOption>) {
        Object.assign(this, partial);
    }
}