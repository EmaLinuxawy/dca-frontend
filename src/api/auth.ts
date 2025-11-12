import apiClient from './client'
import type { UserLogin, UserResponse, Token, TokenData } from './types'

export const authApi = {
  // Login
  login: async (data: UserLogin): Promise<Token> => {
    // Use URLSearchParams for form-urlencoded (OAuth2PasswordRequestForm expects this)
    const params = new URLSearchParams()
    params.append('username', data.username)
    params.append('password', data.password)

    const response = await apiClient.post<Token>('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<TokenData> => {
    const response = await apiClient.post<TokenData>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return response.data
  },

  // Get current user
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/auth/me')
    return response.data
  },

  // Change password
  changePassword: async (data: { current_password: string; new_password: string }): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/change-password', data)
    return response.data
  },
}

