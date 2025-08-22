import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserAvatarInline } from './UserAvatarInline';

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
