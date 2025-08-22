import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Toolbar } from './Toolbar';

const mockStore = configureStore({
  reducer: {
    edit: () => ({ activeFilters: {}, cloudPresets: [] }),
    auth: () => ({
      user: {
        uid: 'user1',
        displayName: 'testuser',
        email: 'test@email.com',
        photoURL: '',
      },
    }),
  },
});

describe('Toolbar', () => {
  it('renders toolbar', () => {
    render(
      <Provider store={mockStore}>
        <Toolbar canvas={null} image={null} />
      </Provider>
    );
    expect(screen.getByText(/Basic/i)).toBeInTheDocument();
    expect(screen.getByText(/Curves/i)).toBeInTheDocument();
    expect(screen.getByText(/HSL/i)).toBeInTheDocument();
    expect(screen.getByText(/Presets/i)).toBeInTheDocument();
  });
});
