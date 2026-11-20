import type { Metadata } from 'next';
import SessionLibraryPage from '@/components/SessionLibraryPage';

export const metadata: Metadata = {
  title: 'Session Library — BoothScript',
  description:
    'Search, manage, rename, export, and reopen your saved BoothScript dictation sessions stored in your browser.',
};

export default function SessionsPage() {
  return <SessionLibraryPage />;
}
