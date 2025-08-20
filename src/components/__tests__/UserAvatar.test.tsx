import { render, screen } from '@testing-library/react';
import UserAvatar from '../UserAvatar/UserAvatar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

const mockStore = configureStore({
  reducer: {
    auth: () => ({
      user: {
        uid: 'user1',
        displayName: 'TestUser',
        email: 'test@email.com',
        photoURL: '',
      },
    }),
  },
});

describe('UserAvatar', () => {
  it('renders user avatar', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <UserAvatar />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});
