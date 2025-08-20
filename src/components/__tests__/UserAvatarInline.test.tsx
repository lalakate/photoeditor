import { render, screen } from '@testing-library/react';
import UserAvatarInline from '../UserAvatar/UserAvatarInline';
import { MemoryRouter } from 'react-router-dom';

describe('UserAvatarInline', () => {
  it('renders user avatar and name', () => {
    render(
      <MemoryRouter>
        <UserAvatarInline userId="1" displayName="TestUser" photoURL="" />
      </MemoryRouter>
    );
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});
