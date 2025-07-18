import { Group, Button, Text, Avatar } from '@mantine/core'
import { IconLogout, IconSettings, IconMail } from '@tabler/icons-react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { notifications } from '@mantine/notifications'

interface DashboardHeaderProps {
  user: {
    email: string
    first_name: string
    last_name: string
  } | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      await api.post('/auth/logout/', { refresh_token: refreshToken })
    } catch (error) {
      // Continue with logout even if API call fails
    }
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    notifications.show({
      title: 'Logged out',
      message: 'You have been logged out successfully',
      color: 'blue',
    })
    router.push('/')
  }

  if (!user) return null

  return (
    <Group justify="space-between">
      <div>
        <Text size="xl" fw={700}>Job Application Tracker</Text>
        <Text size="sm" c="dimmed">Welcome back, {user.first_name || user.email}</Text>
      </div>
      
      <Group>
        <Button
          variant="subtle"
          leftSection={<IconMail size={16} />}
          onClick={() => router.push('/emails')}
        >
          Emails
        </Button>
        <Button
          variant="subtle"
          leftSection={<IconSettings size={16} />}
          onClick={() => router.push('/settings')}
        >
          Settings
        </Button>
        <Button
          variant="subtle"
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Group>
    </Group>
  )
}