import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { LoginPage } from '../src/pages/LoginPage';
import { BrowserRouter } from 'react-router';

describe('LoginPage', () => {
    test('performs login successfully', async () => {
        const screen = await render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        const userField = screen.getByPlaceholder('Username');
        const passField = screen.getByPlaceholder('Password');

        await userField.fill('testuser');
        await passField.fill('password123');

        await screen.getByRole('button', { name: 'Login' }).click();
        await expect.element(screen.getByText('Invalid credentials')).not.toBeInTheDocument();
    });
});