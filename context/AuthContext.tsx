import React, { createContext, useContext, useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { UserType } from '@/types/UserType'
import { secureStorageKeys } from '@/constants/SecureStore'
import trpc from '@/constants/trpc'

type Session = {
  user?: UserType
  authenticated: boolean
}

type AuthContextProps = {
  session: Session
  signIn: (user: UserType, token: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session>({
    authenticated: false
  })
  const { refetch, data, error } = trpc.fetchUserData.useQuery(undefined, {
    enabled: false
  })
  console.log({ error })

  useEffect(() => {
    // Check for token on component mount
    const fetchSession = async () => {
      const token = await SecureStore.getItemAsync(secureStorageKeys.TOKEN)
      if (token) {
        // Trigger fetching user data
        await refetch()
      }
    }

    fetchSession()
  }, [refetch])

  useEffect(() => {
    if (data) {
      // Set session once user data is retrieved
      setSession({ authenticated: true, user: data })
    }
  }, [data])

  const signIn = async (user: UserType, token: string) => {
    await SecureStore.setItemAsync(
      secureStorageKeys.TOKEN,
      JSON.stringify(token)
    )
    setSession({ authenticated: true, user })
  }

  const signOut = async () => {
    setSession({ user: undefined, authenticated: false })
    await SecureStore.deleteItemAsync(secureStorageKeys.TOKEN)
  }

  return (
    <AuthContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
