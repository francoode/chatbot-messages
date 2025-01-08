import { Exclude, Transform, Type } from "class-transformer";
import { PresetMessage } from "../entities/preset-message.model";
import { PresetMessageOptionSerializer } from "./message-option.dto";

export class PresetMessageSerializer {
    @Exclude()
    createdAt: any;

    @Exclude()
    updatedAt: any;

    @Type(() => PresetMessageOptionSerializer)
    options: PresetMessageOptionSerializer[]

    @Transform(({ value }) => (value ? value.id : null))
    answerMessage: PresetMessage;

    constructor(partial: Partial<PresetMessage>) {
        Object.assign(this, partial);
    }
}