'use server';
import { register, login } from '../api/auth';
import { setTokenCookie, setUserDataCookie, clearAuthCookies } from '../cookies';
import { redirect } from 'next/navigation';

export async function handleRegisterUser(data: any) {
  try {
    const result = await register(data);
    if (result.success) {
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message || 'Registration failed' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Registration failed' };
  }
}

export async function handleLoginUser(data: any) {
  try {
    const result = await login(data);
    if (result.success && result.data) {
      await setTokenCookie(result.data.token);
      await setUserDataCookie(result.data.user);
      redirect('/dashboard');
    }
    return { success: false, message: result.message || 'Login failed' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Login failed' };
  }
}