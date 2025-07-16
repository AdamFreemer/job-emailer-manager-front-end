'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Container, Loader, Text, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { api } from '@/lib/api'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasRun = useRef(false)

  const handleCallback = async () => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      notifications.show({
        title: 'Authentication Failed',
        message: 'No authorization code received',
        color: 'red',
      })
      router.push('/')
      return
    }

    try {
      const response = await api.post('/auth/oauth/google/callback/', {
        code,
        state,
      })

      const { access_token, refresh_token, user } = response.data

      // Store tokens
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      notifications.show({
        title: 'Welcome!',
        message: `Logged in as ${user.email}`,
        color: 'green',
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Authentication failed:', error)
      notifications.show({
        title: 'Authentication Failed',
        message: 'Failed to complete authentication',
        color: 'red',
      })
      router.push('/')
    }
  }

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasRun.current) return
    hasRun.current = true
    
    handleCallback()
  }, [handleCallback])

  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="md" mt={100}>
        <Loader size="lg" />
        <Text size="lg">Completing authentication...</Text>
      </Stack>
    </Container>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <Container size="sm" py="xl">
        <Stack align="center" gap="md" mt={100}>
          <Loader size="lg" />
          <Text size="lg">Loading...</Text>
        </Stack>
      </Container>
    }>
      <CallbackContent />
    </Suspense>
  )
}