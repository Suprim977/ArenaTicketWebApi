import { cookies } from 'next/headers';

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 86400 });
}

export async function setUserDataCookie(userData: any) {
  const cookieStore = await cookies();
  cookieStore.set('user_data', JSON.stringify(userData), { secure: false, sameSite: 'lax', maxAge: 86400 });
}

export async function getUserData() {
  const cookieStore = await cookies();
  const userDataCookie = cookieStore.get('user_data')?.value;
  return userDataCookie ? JSON.parse(userDataCookie) : null;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  cookieStore.delete('user_data');
}