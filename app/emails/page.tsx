'use client'

import { useEffect, useState } from 'react'
import { Container, Title, Button, Group, Stack, Card, Badge, Text, Loader, ActionIcon } from '@mantine/core'
import { IconRefresh, IconMail, IconCheck, IconBriefcase } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { notifications } from '@mantine/notifications'
import { api } from '@/lib/api'

interface Email {
  id: number
  subject: string
  sender: string
  sender_email: string
  date_received: string
  status: string
  is_job_related: boolean | null
  has_application: boolean
}

export default function EmailsPage() {
  const router = useRouter()
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      const response = await api.get('/gmail/')
      setEmails(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch emails:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to load emails',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const syncEmails = async () => {
    setFetching(true)
    try {
      const response = await api.post('/gmail/fetch/', {
        days_back: 7,
        max_results: 50
      })
      
      notifications.show({
        title: 'Success',
        message: response.data.message,
        color: 'green',
      })
      
      // Refresh the list
      await fetchEmails()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to sync emails',
        color: 'red',
      })
    } finally {
      setFetching(false)
    }
  }

  const createApplication = async (emailId: number) => {
    // For now, just navigate to a form
    // In a real app, you'd open a modal or form
    notifications.show({
      title: 'Coming Soon',
      message: 'Application creation form will be added here',
      color: 'blue',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNREAD': return 'blue'
      case 'READ': return 'gray'
      case 'PROCESSED': return 'green'
      case 'IGNORED': return 'red'
      default: return 'gray'
    }
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Title order={2}>Email Inbox</Title>
            <Text size="sm" c="dimmed">Job-related emails from Gmail</Text>
          </div>
          <Group>
            <Button
              variant="subtle"
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={syncEmails}
              loading={fetching}
            >
              Sync Gmail
            </Button>
          </Group>
        </Group>

        {loading ? (
          <Card withBorder p="xl" ta="center">
            <Loader />
            <Text mt="md">Loading emails...</Text>
          </Card>
        ) : emails.length === 0 ? (
          <Card withBorder p="xl" ta="center">
            <IconMail size={48} stroke={1.5} style={{ opacity: 0.5 }} />
            <Text size="lg" fw={500} mt="md">No emails yet</Text>
            <Text size="sm" c="dimmed" mt="xs">
              Click &quot;Sync Gmail&quot; to fetch your recent job-related emails
            </Text>
          </Card>
        ) : (
          <Stack gap="sm">
            {emails.map((email) => (
              <Card key={email.id} withBorder padding="md">
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Group gap="sm" mb="xs">
                      <Badge color={getStatusColor(email.status)} size="sm">
                        {email.status}
                      </Badge>
                      {email.is_job_related && (
                        <Badge color="green" variant="light" size="sm">
                          Job Related
                        </Badge>
                      )}
                      {email.has_application && (
                        <Badge color="blue" variant="light" size="sm">
                          <IconCheck size={12} /> Application Created
                        </Badge>
                      )}
                    </Group>
                    
                    <Text fw={500} size="md" lineClamp={1}>
                      {email.subject}
                    </Text>
                    
                    <Group gap="xs" mt="xs">
                      <Text size="sm" c="dimmed">From:</Text>
                      <Text size="sm">{email.sender}</Text>
                    </Group>
                    
                    <Text size="xs" c="dimmed" mt="xs">
                      {new Date(email.date_received).toLocaleString()}
                    </Text>
                  </div>
                  
                  {!email.has_application && email.is_job_related !== false && (
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconBriefcase size={14} />}
                      onClick={() => createApplication(email.id)}
                    >
                      Create Application
                    </Button>
                  )}
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  )
}