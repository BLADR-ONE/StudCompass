import { redirect } from 'next/navigation';
import { auth } from '../../lib/auth.js';

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (session?.user?.role !== 'admin') {
    redirect('/');
  }

  return children;
}

