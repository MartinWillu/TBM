import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { GroceryPage } from '../src/pages/GroceryPage';
import { BrowserRouter } from 'react-router';

describe('GroceryPage', () => {
    test('loads and displays groceries', async () => {
        const screen = await render(
            <BrowserRouter>
                <GroceryPage />
            </BrowserRouter>
        );

        await expect.element(screen.getByText('Loading groceries...')).toBeInTheDocument();
        // Wait for the specific grocery from your mock data
        await expect.element(screen.getByText('Loading groceries...')).not.toBeInTheDocument();
        // Check for common elements
        await expect.element(screen.getByRole('heading', { name: 'Groceries' })).toBeInTheDocument();
    });
});