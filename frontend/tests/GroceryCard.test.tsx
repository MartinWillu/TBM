import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { GroceryCard } from '../src/components/GroceryCard';
import type { Grocery } from '../src/types';

const mockGrocery: Grocery = {
    id: 1,
    name: 'Test Apple',
    currentPrice: 20,
    oldPrice: 25,
    quantity: 10,
    storeId: 1,
    logoUrl: '/apple.png'
};

describe('GroceryCard', () => {
    test('renders grocery information', async () => {
        const { getByText } = await render(<GroceryCard grocery={mockGrocery} />);

        await expect.element(getByText('Test Apple')).toBeInTheDocument();
        await expect.element(getByText(/Quantity: 10/)).toBeInTheDocument();
        await expect.element(getByText('20,00 kr')).toBeInTheDocument();
    });

    test('handles clicks', async () => {
        const handleClick = vi.fn();
        const { getByRole } = await render(<GroceryCard grocery={mockGrocery} onClick={handleClick} />);

        await getByRole('button').click();

        expect(handleClick).toHaveBeenCalled();
    });
});