/* eslint-disable @typescript-eslint/no-misused-promises */
import { redirect } from 'next/navigation';
import React from 'react';
import { handleLogout } from './server-action';
import db from '@/lib/db';
import getSession from '@lib/getSession';

const getUserInfo = async () => {
  const session = await getSession();
  if (session?.id) {
    const user = db.user.findUnique({
      where: { id: session.id },
    });
    return user;
  }
  return redirect('/login');
};

async function ProfilePage() {
  const user = await getUserInfo();

  return (
    <div>
      <div>{user?.username}</div>
      <form action={handleLogout}>
        <button type={'submit'}>{'로그아웃'}</button>
      </form>
    </div>
  );
}

export default ProfilePage;
