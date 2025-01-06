import { NotFoundException } from '@nestjs/common';
import { PresetMessage } from '../entities/preset-message.model';

export const checkOption = (
	presetMessage: PresetMessage,
	optionToCheck: number,
): boolean => {
	const msgResponse = presetMessage.options.find((opt) => Number(opt) === Number(optionToCheck));
	if (!msgResponse) throw new NotFoundException('Invalid option');

	return true;
};
