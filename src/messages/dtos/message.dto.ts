import { Exclude, Type } from "class-transformer";
import { Message } from "../entities/message.model";
import { PresetMessageSerializer } from "./preset-message.dto";
import { IsNotEmpty, IsNumber } from "class-validator";

export class MessageSerializer {
    @Type(() => PresetMessageSerializer)
    presetMessage: PresetMessageSerializer;
  
    constructor(partial: Partial<Message>) {
      Object.assign(this, partial);
    }
}

export class AddMessageDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  chatId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  optionSelectedId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  presetMessageId: number;

  isRoot? = false;
  isTerminal? = false;
}