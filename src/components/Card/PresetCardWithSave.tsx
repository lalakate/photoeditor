import React from 'react';
import { CloudPreset, PresetService } from '../../services/presetService';
import { useAppSelector } from '../../store/hooks';
import UserAvatarInline from '../../components/UserAvatar/UserAvatarInline';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase/firebaseConfig';
import './preset-card-with-save.css';

interface PresetCardProps {
  preset: CloudPreset;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset }) => {
  const currentUser = useAppSelector(state => state.auth.user);
  const isOwnPreset = currentUser && currentUser.uid === preset.userId;

  const handleSave = async () => {
    try {
      await PresetService.savePreset(
        currentUser?.uid || 'unknown',
        currentUser?.displayName || currentUser?.email || 'Unknown User',
        { name: preset.name, filters: preset.filters },
        currentUser?.photoURL || ''
      );
    } catch (error) {
      logEvent(analytics, 'save_preset_error', { message: error });
    }
  };

  const displayName = React.useMemo(() => {
    if (!preset.userName) return '';
    const atIdx = preset.userName.indexOf('@');
    return atIdx > 0 ? preset.userName.slice(0, atIdx) : preset.userName;
  }, [preset.userName]);

  return (
    <div className="feed-card">
      <div className="feed-image-container">
        <img
          src={preset.previewUrl}
          alt={preset.name}
          className="feed-image-save"
        />
      </div>
      <div className="feed-card-left">
        <div className="feed-user-info">
          <UserAvatarInline
            userId={preset.userId}
            displayName={displayName}
            photoURL={preset.userPhotoURL}
          />
          <span className="feed-author-name">{displayName}</span>
        </div>
        <div className="feed-card-info">
          <h3 className="feed-preset-name">{preset.name}</h3>
          {!isOwnPreset && (
            <button
              className="feed-save-preset-btn"
              onClick={handleSave}
              title="Save preset to my account"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresetCard;
