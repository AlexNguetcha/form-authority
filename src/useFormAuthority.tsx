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
        if (!errors[name]) return;

        if (!options.errorRender) {
            return FormAuthorityError(name, errors[name])
        }

        return options.errorRender(name, errors[name])
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
        }
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