import { screen, fireEvent, render, renderHook, RenderResult, waitFor, cleanup } from '@testing-library/react';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { act } from 'react-dom/test-utils';
import useFormAuthority, { FormAuthorityOptions } from '../src';

describe('useFormAuthority', () => {
    let options: FormAuthorityOptions;

    beforeEach(() => {
        options = {
            initialValues: {
                name: '',
                age: ''
            },
            validator: {
                name: 'required',
                age: 'required|min:1|max:120'
            },
            autoRenderError: false,
            renderErrorOnChange: true
        };
    });

    it('should update the form field values', () => {
        const { result } = renderHook(() => useFormAuthority(options));

        act(() => {
            result.current.handleChange({
                target: {
                    name: 'name',
                    value: 'John Doe'
                }
            } as ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.values.name).toBe('John Doe');
    });

    it('should validate the form fields and update the error messages', () => {
        const { result } = renderHook(() => useFormAuthority(options));

        act(() => {
            result.current.handleChange({
                target: {
                    name: 'name',
                    value: ''
                }
            } as ChangeEvent<HTMLInputElement>);

            result.current.handleValidate();
        });

        expect(result.current.errors.name).toBe('name is required');
    });

    it('should render a custom error message for a specific form field', () => {
        options.errorRender = (name, error) => (
            <div data-testid="custom-error">
                {name}: {error}
            </div>
        );

        const { result } = renderHook(() => useFormAuthority(options));

        act(() => {
            result.current.handleChange({
                target: {
                    name: 'age',
                    value: '0'
                }
            } as ChangeEvent<HTMLInputElement>);

            result.current.handleValidate();
        });

        const error = result.current.renderError('age');

        expect(error.props['data-testid']).toBe('custom-error');
    });
});
