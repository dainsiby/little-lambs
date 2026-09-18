'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="secondary-cta flex items-center gap-2 text-xs font-bold px-4 py-2 text-[#74291e] border border-[#74291e] rounded-full hover:bg-[#74291e] hover:text-[#fffdf7] transition-colors"
    >
      <LogOut size={14} />
      <span>Sign Out</span>
    </button>
  );
}
