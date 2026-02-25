import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { BrowserRouter } from 'react-router';
import Navbar from '../src/components/Navbar';

describe('Navbar', () => {
    const logoutFunc = vi.fn();
    const links = [
        { text: 'Home', url: '/' },
        { text: 'Stores', url: '/stores' },
        { text: 'Logout', url: '/logout', onClickAction: logoutFunc }
    ];

    test('renders navigation links', async () => {
        const { getByText } = await render(
            <BrowserRouter>
                <Navbar links={links} />
            </BrowserRouter>
        );

        await expect.element(getByText('Home')).toBeInTheDocument();
        await expect.element(getByText('Stores')).toBeInTheDocument();
    });

    test('shows logout button when onLogout is provided', async () => {
        const { getByText } = await render(
            <BrowserRouter>
                <Navbar links={links} />
            </BrowserRouter>
        );
        const logoutBtn = getByText('Logout');
        await expect.element(logoutBtn).toBeInTheDocument();

        await logoutBtn.click();
        expect(logoutFunc).toHaveBeenCalled();
    });
});