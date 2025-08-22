import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { PresetCardWithSave } from './PresetCardWithSave';

const mockStore = configureStore({
  reducer: {
    auth: () => ({
      user: {
        uid: 'user1',
        displayName: 'testuser',
        email: 'testuser@email.com',
        photoURL: '',
      },
    }),
  },
});

const mockTimestamp = {
  seconds: 0,
  nanoseconds: 0,
  toDate: () => new Date(0),
  toMillis: () => 0,
  isEqual: () => true,
  toJSON: () => ({ seconds: 0, nanoseconds: 0, type: 'Timestamp' }),
  valueOf: () => '',
};

const mockPreset = {
  id: '1',
  name: 'Test Preset',
  filters: {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    sharpen: 0,
    hue: 0,
    hslSaturation: 0,
    lightness: 0,
    curves: null,
  },
  userId: 'user1',
  userName: 'testuser',
  userPhotoURL: '',
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp,
  previewUrl: 'test.jpg',
  downloads: 0,
};

describe('PresetCardWithSave', () => {
  it('renders preset name and author', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PresetCardWithSave preset={mockPreset} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Test Preset/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });
});
