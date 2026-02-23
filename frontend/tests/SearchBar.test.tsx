import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { SearchBar } from '../src/components/SearchBar';

describe('SearchBar', () => {
    test('renders correctly', async () => {
        const { getByPlaceholder } = await render(
            <SearchBar value="" onChange={() => { }} />
        );
        await expect.element(getByPlaceholder('Search stores...')).toBeInTheDocument();
    });

    test('calls onChange when typing', async () => {
        const onChange = vi.fn();
        const { getByPlaceholder } = await render(
            <SearchBar value="" onChange={onChange} />
        );

        // vitest-browser-react handles user events naturally
        await getByPlaceholder('Search stores...').fill('Kiwi');

        expect(onChange).toHaveBeenCalled();
    });
});