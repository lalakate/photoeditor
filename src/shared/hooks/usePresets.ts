import { analytics } from '@/app/firebase/firebaseConfig';
import { CloudPreset, PresetService } from '@/features';
import * as Sentry from '@sentry/react';
import { logEvent } from 'firebase/analytics';
import { useEffect, useState } from 'react';

export const usePresets = (userId?: string) => {
  const [presets, setPresets] = useState<CloudPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        setIsLoading(true);
        let fetchedPresets: CloudPreset[];

        if (userId) {
          fetchedPresets = await PresetService.getUserPresets(userId);
          Sentry.captureMessage('Fetched user presets', {
            level: 'info',
            extra: { userId, count: fetchedPresets.length },
          });
        } else {
          fetchedPresets = await PresetService.getPublicPresets();
          Sentry.captureMessage('Fetched public presets', {
            level: 'info',
            extra: { count: fetchedPresets.length },
          });
        }

        setPresets(fetchedPresets);

        logEvent(analytics, 'fetch_presets', {
          userId: userId || 'public',
          count: fetchedPresets.length,
        });
      } catch (err) {
        setError('Failed to load presets');
        Sentry.captureException(err, {
          level: 'error',
          extra: { userId: userId || 'public' },
        });
        logEvent(analytics, 'fetch_presets_error', {
          userId: userId || 'public',
          message: (err as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresets();
  }, [userId]);

  return { presets, isLoading, error, setPresets, setError, setIsLoading };
};
