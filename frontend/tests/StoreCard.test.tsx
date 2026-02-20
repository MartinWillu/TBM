import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { StoreCard } from '../src/components/StoreCard';
import type { Store } from '../src/types';

const mockStore: Store = {
    id: 1,
    name: 'Test Store',
    logoUrl: '/logo.png',
    userId: 1,
    groceriyId: 0,
    groceries: []
};

describe('StoreCard', () => {
    test('renders store details', async () => {
        const { getByText, getByRole } = await render(
            <StoreCard store={mockStore} />
        );

        await expect.element(getByText('Test Store')).toBeInTheDocument();
        const img = getByRole('img');
        await expect.element(img).toBeInTheDocument();
    });

    test('handles click', async () => {
        const handleClick = vi.fn();
        const { getByText } = await render(
            <StoreCard store={mockStore} onClick={handleClick} />
        );

        await getByText('Test Store').click();
        expect(handleClick).toHaveBeenCalledWith(mockStore);
    });
});