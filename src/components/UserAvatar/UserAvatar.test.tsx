import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { UserAvatar } from './UserAvatar';

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
