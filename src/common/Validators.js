const numberRegExp = new RegExp("^[0-9]+$");

export const required = value => value && value.trim() !== '' ? undefined : 'Required field';

export const mustBeFormat = value => value && value.trim()[0] !== '+' ? 'Must be format: +380XXXXXXXXX' : undefined;

export const mustBePhoneNumber = value => {
    if (value) {
        const val = value.trim()
        return val.length > 1 && !numberRegExp.test(val.slice(1)) ? 'Must be a phone number' : undefined
    }
}

export const mustBeNumber = value => !numberRegExp.test(value.trim()) ? 'Must be a number' : undefined;

export const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);