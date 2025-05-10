import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from './SearchInput';

// Mock the Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn((key) => key === 'q' ? 'initial query' : null),
    toString: () => '',
  }),
}));

describe('SearchInput', () => {
  it('renders the search input with default value', () => {
    render(<SearchInput />);
    
    const input = screen.getByLabelText('検索クエリ');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('initial query');
  });

  it('updates the search query when typed', () => {
    render(<SearchInput />);
    
    const input = screen.getByLabelText('検索クエリ');
    fireEvent.change(input, { target: { value: 'new search' } });
    
    expect(input).toHaveValue('new search');
  });

  it('has a search button', () => {
    render(<SearchInput />);
    
    const button = screen.getByText('検索');
    expect(button).toBeInTheDocument();
  });
});