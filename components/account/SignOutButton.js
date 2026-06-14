'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Button from '../ui/Button.js';

export default function SignOutButton({ className = '' }) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ redirectTo: '/' });
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      loading={loading}
      onClick={handleSignOut}
      className={className}
    >
      Ieși din cont
      {!loading && (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="size-3.5"
        >
          <path
            d="M6 2.5H3.5v11H6M10.5 5l3 3-3 3m3-3h-8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Button>
  );
}
