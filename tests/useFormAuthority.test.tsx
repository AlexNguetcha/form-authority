import { screen, fireEvent, render, renderHook, RenderResult, waitFor, cleanup } from '@testing-library/react';
import React, { useEffect, useRef } from 'react';
import { act } from 'react-dom/test-utils';
import useFormAuthority, { FormAuthorityOptions } from '../src';
import { JsonType } from '../src/useFormAuthority';


describe('useFormAuthority', () => {
    let initialValues = {
        name: 'John Doe',
        email: 'johndoe@gmail.com'
    };

    let options: FormAuthorityOptions = {
        initialValues,
        validator: function (name, value) {
            if (name === 'username') {
                if (!/^[a-z]{3,}$/.test(value.toString().toLowerCase()))
                    return 'invalid username'
            }
            return null;
        },
        autoRenderError: false,
        renderErrorOnChange: false
    };

    beforeEach(() => {
    });

    afterEach(cleanup)

    test('formAuthority value change on ChangeEvent', async () => {
        const TestComponent = () => {
            const { values, handleChange } = useFormAuthority(options)

            return <form>
                <input data-testid='username' name='username' type={'text'} value={values.username} onChange={handleChange} />
            </form>
        }

        render(<TestComponent />);

        const userNameInput = (screen.getByTestId('username') as HTMLInputElement);

        await waitFor(() => {
            fireEvent.change(userNameInput, { target: { value: 'Alex', name: 'name' } });
        });

        expect(userNameInput.value).toBe('Alex');
    });

    test('formAuthority renders error properly', async () => {
        const TestComponent = () => {
            options.initialValues = { username: '123' };
            options.errorRender = (name, error) => <span data-testid={`${name}-error`}>{error}</span>;
            options.validator = (name, value) => 'invalid username';

            const { values, errors, renderError, handleChange, handleSubmit } = useFormAuthority(options)

            return <form data-testid='form' onSubmit={handleSubmit}>
                <input data-error={errors.username} data-testid='username' name='username' type={'text'} value={values.username} onChange={handleChange} />
                {errors.username && <span>{errors.username}</span>}
            </form>
        }

        render(<TestComponent />);

        expect(screen.queryByTestId('username-error')).toBeNull();

        act(() => {
            (screen.getByTestId('form') as HTMLFormElement).submit();
        });

        const errorMessage = screen.getByTestId('username-error')
        expect(errorMessage).not.toBeNull();
        expect(errorMessage).toHaveTextContent('invalid username');


    });




})