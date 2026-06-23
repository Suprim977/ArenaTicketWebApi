'use client'

export async function handleLoginUser(data: any) {
  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()

    if (json.success && json.data?.token) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', json.data.token)
        window.localStorage.setItem('user', JSON.stringify(json.data.user))
      }
      return {
        success: true, 
        data: {
          token: json.data.token,
          user: json.data.user
        }
      }
    }
    return { success: false, message: json.message || 'Login failed' }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Network error'
    }
  }
}

export async function handleRegisterUser(data: any) {
  try {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    return { success: json.success, message: json.message }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Registration failed'
    }
  }
}