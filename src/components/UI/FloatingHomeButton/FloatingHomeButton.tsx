import React from 'react';
import { useNavigate } from 'react-router-dom';
import './floating-home-btn.css';
import { useAppSelector } from '../../../store/hooks';

const FloatingHomeButton: React.FC = () => {
  const { isAuthorized } = useAppSelector(state => state.auth);

  const navigate = useNavigate();
  return (
    <button
      className={`floating-home-btn ${!isAuthorized && 'hidden'}`}
      title="Go to Preset Feed"
      onClick={() => navigate('/feed')}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5L12 4l9 5.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </button>
  );
};

export default FloatingHomeButton;
