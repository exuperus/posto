// src/components/MailLink.tsx
'use client';
import React from 'react';

export default function MailLink({ email, className }: { email: string; className?: string }) {
    const href = `mailto:${email}`;
    return (
        <a
            href={href}
            className={className}
            onClick={() => console.log("[MailLink] click mailto:", href)}
        >
            {email}
        </a>
    );
}
