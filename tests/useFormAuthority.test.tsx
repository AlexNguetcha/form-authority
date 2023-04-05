import { screen, fireEvent, render, renderHook, RenderResult, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
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
            if (name === 'name') {
                if (!/^[a-z]{3,}$/.test(value.toString().toLowerCase()))
                    return 'invalid name'
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

    


})