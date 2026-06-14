import { redirect } from 'next/navigation';
import { auth } from '../../../lib/auth.js';

export default async function ProtectedAccountLayout({ children }) {
  const session = await auth();

  if (!session?.user || session.user.banned) {
    redirect('/account/auth');
  }

  return children;
}

