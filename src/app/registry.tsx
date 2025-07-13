'use client';

import React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

export default function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const cache = React.useMemo(
    () =>
      createCache({
        key: 'mui',
        prepend: true,
      }),
    []
  );

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) {
      return null;
    }
    const styles = names
      .map((name) => cache.inserted[name])
      .filter(Boolean)
      .join('');
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}