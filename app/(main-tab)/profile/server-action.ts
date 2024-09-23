import { redirect } from 'next/navigation';
import getSession from '@/lib/getSession';

export const handleLogout = async () => {
  'use server';

  const session = await getSession();
  session.destroy();
  await session.save();
  redirect('/');
};
