import { isAscii, passwordMinRequirements } from './string';
import { useState } from 'react'

export const usePasswordValidator = (setExternalState) => {
	const [state, setState] = useState(true)
	return [state, (v) => {
		const isValid = passwordMinRequirements(v);
		setState(isValid);

		isValid && setExternalState(v);
	}];
}

export const useAsciiValidator = (setExternalState) => {
	const [state, setState] = useState(true)
	return [state, (v) => {
		const isValid = isAscii(v);
		setState(isValid);

		isValid && setExternalState(v);
	}];
}
