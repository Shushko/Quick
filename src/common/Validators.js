const numberRegExp = new RegExp("^[0-9]+$");
const MAX_LENGTH = 16;

export const required = value => value && value.trim() !== '' ? undefined : 'Required field';

export const mustBePhoneNumber = value => {
    if (value) {
        const val = value.trim()
        if (value.trim()[0] !== '+') {
            return 'Must be format: +380XXXXXXXXX'
        } else if (val.length > 1 && !numberRegExp.test(val.slice(1))) {
            return 'Must be a phone number'
        } else {
            return undefined
        }
    }
}

export const mustBeNumber = value => !numberRegExp.test(value.trim()) ? 'Must be a number' : undefined;

export const limitLength = value => value && value.length > MAX_LENGTH ? 'Max length - 16 symbols' : undefined;

export const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);