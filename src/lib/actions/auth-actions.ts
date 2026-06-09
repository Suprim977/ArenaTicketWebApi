'use server'

import { cookies } from 'next/headers'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export async function handleLoginUser(data: any) {
  try {
    const res = await axios.post(API_URL + '/auth/login', data)
    
    if (res.data.success && res.data.data?.token) {
      const cookieStore = await cookies()
      cookieStore.set('token', res.data.data.token, { 
        httpOnly: true, 
        secure: false, 
        maxAge: 60 * 60 * 24 * 7 
      })
      return { 
        success: true, 
        data: {
          token: res.data.data.token,
          user: res.data.data.user
        }
      }
    }
    return { success: false, message: res.data.message || 'Login failed' }
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Network error' 
    }
  }
}

export async function handleRegisterUser(data: any) {
  try {
    const res = await axios.post(API_URL + '/auth/register', data)
    return { success: res.data.success, message: res.data.message }
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Registration failed' 
    }
  }
}