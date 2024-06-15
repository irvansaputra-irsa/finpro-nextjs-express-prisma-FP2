'use client';
import React from 'react';

export default function ErrorBoundary({ error }: { error: Error }) {
  return <div>{error.message}</div>;
}
