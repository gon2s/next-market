import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface ISession {
  id?: number;
}

const getSession = async () => {
  const cookie = await getIronSession<ISession>(cookies(), {
    cookieName: 'gon-market',
    password: process.env.COOKIE_PASSWORD!,
  });
  return cookie;
};

export default getSession;
