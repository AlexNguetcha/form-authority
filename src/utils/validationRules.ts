import validator from 'validator';

export type Rule = 'required'|'min'|'min'|'max'|'email'|'url'|'number'|'positive'|'negative'
|'integer'|'decimal'|'alphabetic'|'alphanumeric'|'regex';

export type RuleFunction = (fieldName:string, fieldValue:string, ...params: any) => string | true;

export const ValidationRules:Record<Rule, RuleFunction> = {
    required: (fieldName: string, fieldValue: any, errorMessage?: string) => !validator.isEmpty(`${fieldValue}`) || errorMessage || 'This field is required',
    min: (fieldName: string, fieldValue: any, minLength: any, errorMessage?: string) => validator.isLength(`${fieldValue}`, { min: Number(minLength) }) || errorMessage || `This field must be at least ${minLength} characters long`,
    max: (fieldName: string, fieldValue: any, maxLength: any, errorMessage?: string) => validator.isLength(`${fieldValue}`, { max: Number(maxLength) }) || errorMessage || `This field must be at most ${maxLength} characters long`,
    email: (fieldName: string, fieldValue: any, errorMessage?: string) => validator.isEmail(`${fieldValue}`) || errorMessage || 'Please enter a valid email address',
    url: (fieldName: string, fieldValue: any, errorMessage?: string) => validator.isURL(`${fieldValue}`) || errorMessage || 'Please enter a valid URL',
    number: (fieldName: string, fieldValue: any, errorMessage?: string) => validator.isNumeric(`${fieldValue}`) || errorMessage || 'Please enter a valid number',
    positive: (fieldName: string, fieldValue: any, errorMessage?: string) => validator.isNumeric(`${fieldValue}`) && Number(fieldValue) > 0 || errorMessage || 'Please enter a positive number',
    negative: (fieldName: string, fieldValue: any, errorMessage?: string) => validator.isNumeric(`${fieldValue}`) && Number(fieldValue) < 0 || errorMessage || 'Please enter a negative number',
    integer: (fieldName: string, fieldValue: any, errorMessage?: string) => validator.isInt(`${fieldValue}`) || errorMessage || 'Please enter a valid integer',
    decimal: (fieldName: string, fieldValue: any, errorMessage?: string) => validator.isDecimal(`${fieldValue}`) || errorMessage || 'Please enter a valid decimal number',
    alphabetic: (fieldName: string, fieldValue: any, errorMessage?: string) => validator.isAlpha(`${fieldValue}`) || errorMessage || 'Please enter alphabetic characters only',
    alphanumeric: (fieldName: string, fieldValue: any, errorMessage?: string) => validator.isAlphanumeric(`${fieldValue}`) || errorMessage || 'Please enter alphanumeric characters only',
    regex: (fieldName: string, fieldValue: any, regex: RegExp, errorMessage?: string) => validator.matches(`${fieldValue}`, regex) || errorMessage || 'Please enter a valid value',
  };
