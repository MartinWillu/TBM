import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { AuthForm } from '../src/components/AuthForm';

describe('AuthForm', () => {
    test('renders input fields for username and password', async () => {
        const { getByPlaceholder, getByRole } = await render(
            <AuthForm onError={() => { }} onSuccess={() => { }} />
        );

        await expect.element(getByPlaceholder('Username')).toBeInTheDocument();
        await expect.element(getByPlaceholder('Password')).toBeInTheDocument();
        await expect.element(getByRole('button')).toBeInTheDocument();
    });

    test('validates missing username', async () => {
        const onError = vi.fn();
        const { getByRole } = await render(
            <AuthForm onError={onError} onSuccess={() => { }} />
        );

        await getByRole('button').click();
        expect(onError).toHaveBeenCalledWith("Username is required!");
    });

    test('validates missing password', async () => {
        const onError = vi.fn();
        const { getByRole, getByPlaceholder } = await render(
            <AuthForm onError={onError} onSuccess={() => { }} />
        );

        await getByPlaceholder('Username').fill('someuser');
        await getByRole('button').click();

        expect(onError).toHaveBeenCalledWith("Password is required!");
    });

    test('calls onSuccess with valid data', async () => {
        const onSuccess = vi.fn();
        const { getByRole, getByPlaceholder } = await render(
            <AuthForm onError={() => { }} onSuccess={onSuccess} />
        );

        await getByPlaceholder('Username').fill('testuser');
        await getByPlaceholder('Password').fill('secret');
        await getByRole('button').click();

        await expect.poll(() => onSuccess).toHaveBeenCalledWith({ username: 'testuser', password: 'secret' });
    });
});