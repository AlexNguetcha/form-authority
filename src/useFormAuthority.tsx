import { ChangeEvent, FocusEvent, useState } from 'react';
import { FormAuthorityError } from './component/FormAuthorityError';
import { Rule, RuleFunction, ValidationRules } from './utils/validationRules';


export type JsonType<T> = Record<string, T>;

export interface FormAuthorityOptions {
    initialValues: JsonType<string | number>
    validator: ((name: string, value: string | number) => string | null) | JsonType<string>,
    errorRender?: (name: string, error: string) => JSX.Element,
    renderErrorOnBlur?: boolean,
    renderErrorOnChange?: boolean,
    customErrorsMessages?: JsonType<string>
}


const useFormAuthority = (options: FormAuthorityOptions) => {

    const [errors, setErrors] = useState<JsonType<string>>({});
    const [values, setValues] = useState<typeof options.initialValues>(options.initialValues);
    const [blurredFields, setBlurredFields] = useState<JsonType<boolean>>({});


    const renderError = (name: string): JSX.Element => {
        if (errors[name]) {
            return options.errorRender ? options.errorRender(name, errors[name]) : FormAuthorityError(name, errors[name]);
        }
    }

    const applyError = (fieldName: string, error: string): void => {
        setErrors((elements) => {
            elements[fieldName] = error;
            return elements;
        });
    }


    const applyValidator = (name: string, value: string | number, forSubmission: boolean = false): void => {
        const shouldRenderError = (error: string | null) =>
            forSubmission || (error !== null && (options.renderErrorOnChange || blurredFields[name]));

        if (typeof options.validator === 'function') {
            const error = options.validator(name, value);
            if (shouldRenderError(error)) {
                applyError(name, error as string);
            }
        } else {
            Object.entries(options.validator).forEach(([fieldName, fieldRules]) => {
                const error = applyValidatorRules(fieldName, value as string, fieldRules.split('|'));
                if (shouldRenderError(error)) {
                    applyError(fieldName, error as string);
                }
            })
        }
    }


    const applyValidatorRules = (fieldName: string, fieldValue: string, rules: string[]): string | null => {

        let errorMessage: string | null = null;
        rules.forEach((rule) => {
            const [ruleName, ...ruleParams] = rule.split(':');
            const validatorFn:RuleFunction = ValidationRules[ruleName as Rule];
            if (!validatorFn) {
                throw new Error(`Unknown validation rule: ${ruleName}`);
            }
            if (options.customErrorsMessages) {
                const error = validatorFn(fieldName, fieldValue, errorMessage = options.customErrorsMessages[ruleName], ...ruleParams,);
            }
            const error = validatorFn(fieldName, fieldValue, ...ruleParams,);
            if (error) {
                errorMessage = error;
            }
        });

        return errorMessage;
    }

    const handleValidate = (): void => {
        Object.keys(values).forEach(key => applyValidator(key, values[key], true));
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {

        setValues({ ...values, [e.target.name]: e.target.value })

        if (options.renderErrorOnChange && e.target.value && e.target.value.length > 0)
            applyValidator(e.target.name, e.target.value)

        if (options.renderErrorOnBlur && blurredFields[e.target.name])
            applyValidator(e.target.name, e.target.value)
    }


    const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
        setBlurredFields({ ...blurredFields, [e.target.name]: true });
    }


    return { values, errors, setValues, setErrors, renderError, handleValidate, handleBlur, handleChange }
}

export default useFormAuthority;