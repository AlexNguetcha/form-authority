import { ChangeEvent, FormEvent } from 'react';
import { LegacyRef, useState } from 'react'
import { FormAuthorityError } from './component/FormAuthorityError';
import validator from 'validator';


export type JsonType<T> = Record<string, T>;

export interface FormAuthorityOptions {
    initialValues: JsonType<string | number>
    validator: ((name: string, value: string | number) => string | null) | JsonType<string>,
    errorRender?: (name: string, error: string) => JSX.Element,
    formRef?: LegacyRef<HTMLFormElement>,
    autoRenderError: boolean,
    renderErrorOnChange: boolean
}


const useFormAuthority = (options: FormAuthorityOptions) => {

    const [errors, setErrors] = useState<JsonType<string>>({});
    const [values, setValues] = useState<JsonType<string | number>>(options.initialValues);

    const renderError = (name: string): JSX.Element => {
        if (!errors[name]) return;

        if (!options.errorRender) {
            return FormAuthorityError(name, errors[name]);
        }

        return options.errorRender(name, errors[name]);
    }

    const applyValidator = (name: string, value: string | number): void => {
        if (typeof options.validator === 'function') {
            const error = options.validator(name, value);
            if (error !== null) {
                setErrors((elements) => {
                    elements[name] = error;
                    return elements;
                })
            }
        } else {
            Object.entries(options.validator).forEach(([fieldName, fieldRules]) => {
                const error = applyValidatorRules(fieldName, value as string, fieldRules.split('|'));
                if (error !== null) {
                    setErrors((elements) => {
                        elements[fieldName] = error;
                        return elements;
                    })
                }

            })
        }
    }

    const applyValidatorRules = (fieldName: string, fieldValue: string, rules: string[]): string | null => {

        let errorMessage: string | null = null;
        rules.forEach((rule) => {

            const [ruleName, ...ruleParams] = rule.split(':');

            switch (ruleName) {
                case 'required':
                    if (validator.isEmpty(`${fieldValue}`)) {
                        errorMessage = `${fieldName} is required`;
                    }
                    break;
                case 'min':
                    if (!validator.isLength(`${fieldValue}`, { min: Number(ruleParams[0]) })) {
                        errorMessage = `${fieldName} must be at least ${ruleParams[0]} characters long`;
                    }
                    break;
                case 'max':
                    if (!validator.isLength(`${fieldValue}`, { max: Number(ruleParams[0]) })) {
                        errorMessage = `${fieldName} must be at most ${ruleParams[0]} characters long`;
                    }
                    break;
                case 'url':
                    if (!validator.isURL(`${fieldValue}`)) {
                        errorMessage = `${fieldName} must be a valid URL`;
                    }
                    break;
                case 'regex':
                    if (!RegExp(ruleParams[0]).test(fieldValue)) {
                        errorMessage = `${fieldName} is not valid`;
                    }
                    break;
                case 'sometimes':
                    if (validator.isEmpty(`${fieldValue}`)) {
                        return;
                    }
                    break;

                default:
                    throw new Error(`Unknown validation rule: ${ruleName}`);
            }
        })

        return errorMessage;
    }

    const handleValidate = (): void => {
        Object.keys(values).forEach(key => applyValidator(key, values[key]))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {

        setValues({ ...values, [e.target.name]: e.target.value })

        if (options.renderErrorOnChange && e.target.value && e.target.value.length > 0)
            applyValidator(e.target.name, e.target.value)
    }

    return { values, errors, setValues, setErrors, renderError, handleValidate, handleChange }
}

export default useFormAuthority;