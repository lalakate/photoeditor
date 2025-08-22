import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

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

describe('Header', () => {
  it('renders logo and login/logout', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/Log out|Log in/i)).toBeInTheDocument();
  });
});
