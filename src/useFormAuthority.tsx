import { ChangeEvent, FormEvent } from 'react';
import { LegacyRef, useState } from 'react'
import { FormAuthorityError } from './component/FormAuthorityError';


export type JsonType<T> = Record<string, T>;

export interface FormAuthorityOptions {
    initialValues: JsonType<string | number>
    validator: ((name: string, value: string | number) => string | null) | string[],
    errorRender?: (name: string, error: string) => JSX.Element,
    formRef?: LegacyRef<HTMLFormElement>,
    autoRenderError: boolean,
    renderErrorOnChange: boolean
}


const useFormAuthority = (options: FormAuthorityOptions) => {

    const [errors, setErrors] = useState<JsonType<string>>({})
    const [values, setValues] = useState<JsonType<string | number>>(options.initialValues)

    const renderError = (name: string): JSX.Element => {
        if (!options.errorRender) {
            return FormAuthorityError(name, errors.name)
        }

        return options.errorRender(name, errors.name)
    }

    const applyValidator = (name: string, value: string | number): void => {
        if (typeof options.validator === 'function') {
            const error = options.validator(name, value)
            if (error !== null) {
                setErrors((errors) => {
                    return { ...errors, key: error };
                })
            }
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const valuesKeys = Object.keys(values);
        let formErrors = {};

        for (const key in valuesKeys) {
            if (typeof options.validator === 'function') {
                const error = options.validator(key, values.key)
                if (error !== null) {
                    applyValidator(key, values.key)
                }
            }
        }

        setErrors(formErrors);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {

        const valuesElements = Object.assign(values);
        valuesElements[e.target.name] = e.target.value;
        
        setValues(valuesElements)

        if (options.renderErrorOnChange && e.target.value && e.target.value.length > 0)
            applyValidator(e.target.name, e.target.value)
    }

    return { values, errors, setValues, setErrors, renderError, handleSubmit, handleChange }
}

export default useFormAuthority;