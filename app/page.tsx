'use client'

import { useEffect } from 'react'
import { Container, Title, Text, Button, Stack } from '@mantine/core'
import { IconBrandGoogle } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/user/')
      if (response.data) {
        router.push('/dashboard')
      }
    } catch (error) {
      // User not authenticated, stay on home page
    }
  }

  const handleGoogleLogin = async () => {
    try {
      console.log('Initiating Google login...')
      const response = await api.get('/auth/oauth/google/')
      console.log('OAuth response:', response.data)
      if (response.data.auth_url) {
        console.log('Redirecting to:', response.data.auth_url)
        window.location.href = response.data.auth_url
      } else {
        console.error('No auth_url in response:', response.data)
        alert('Failed to get authentication URL')
      }
    } catch (error: any) {
      console.error('Failed to initiate Google login:', error)
      console.error('Error details:', error.response?.data)
      // Show user-friendly error
      alert(`Login failed: ${error.response?.data?.error || error.message}`)
    }
  }

  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="xl" mt={100}>
        <Title order={1} size="h2" ta="center">
          Job Emailer Manager
        </Title>
        
        <Text size="lg" ta="center" c="dimmed">
          Track and manage job applications directly from your Gmail inbox
        </Text>

        <Button
          size="lg"
          leftSection={<IconBrandGoogle size={20} />}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
      </Stack>
    </Container>
  )
}
