import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { FloatingHomeButton } from './FloatingHomeButton';

const mockStore = configureStore({
  reducer: {
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

describe('FloatingHomeButton', () => {
  it('renders floating home button', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <FloatingHomeButton />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
