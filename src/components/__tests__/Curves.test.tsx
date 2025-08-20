import { render, screen, fireEvent } from '@testing-library/react';
import Curves from '../Options/Curves';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

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

describe('Curves', () => {
  it('renders curve editor and reset button', () => {
    render(
      <Provider store={mockStore}>
        <Curves />
      </Provider>
    );
    expect(screen.getByText(/Reset Curve/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /reset curve/i })
    ).toBeInTheDocument();
  });

  it('renders canvas', () => {
    render(
      <Provider store={mockStore}>
        <Curves />
      </Provider>
    );
    const canvas = screen.getByTestId('curve-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('allows to reset points', () => {
    render(
      <Provider store={mockStore}>
        <Curves />
      </Provider>
    );
    const resetBtn = screen.getByRole('button', { name: /reset curve/i });
    fireEvent.click(resetBtn);
    expect(resetBtn).toBeInTheDocument();
  });

  it('handles mouse events on canvas', () => {
    render(
      <Provider store={mockStore}>
        <Curves />
      </Provider>
    );
    const canvas = screen.getByTestId('curve-canvas');
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas);
    expect(canvas).toBeInTheDocument();
  });
});
