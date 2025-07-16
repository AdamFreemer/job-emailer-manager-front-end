'use client'

import { useEffect, useState } from 'react'
import { Container, Title, Stack, Card, Text, Button, Switch, TextInput, Group } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { notifications } from '@mantine/notifications'
import { api } from '@/lib/api'

interface DomainFilter {
  id: number
  domain: string
  is_allowed: boolean
  created_at: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [domains, setDomains] = useState<DomainFilter[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await api.get('/auth/domains/')
      setDomains(response.data)
    } catch (error) {
      console.error('Failed to fetch domains:', error)
    } finally {
      setLoading(false)
    }
  }

  const addDomain = async () => {
    if (!newDomain.trim()) return

    try {
      const response = await api.post('/auth/domains/', {
        domain: newDomain,
        is_allowed: true
      })
      setDomains([...domains, response.data])
      setNewDomain('')
      notifications.show({
        title: 'Success',
        message: 'Domain filter added',
        color: 'green',
      })
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to add domain',
        color: 'red',
      })
    }
  }

  const toggleDomain = async (domain: DomainFilter) => {
    try {
      const response = await api.patch(`/auth/domains/${domain.id}/`)
      setDomains(domains.map(d => d.id === domain.id ? response.data : d))
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update domain',
        color: 'red',
      })
    }
  }

  const deleteDomain = async (id: number) => {
    try {
      await api.delete(`/auth/domains/${id}/`)
      setDomains(domains.filter(d => d.id !== id))
      notifications.show({
        title: 'Success',
        message: 'Domain filter removed',
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete domain',
        color: 'red',
      })
    }
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <Title order={2}>Settings</Title>
          <Button variant="subtle" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </Group>

        <Card shadow="sm" padding="lg">
          <Title order={4} mb="md">Domain Filters</Title>
          <Text size="sm" c="dimmed" mb="lg">
            Configure which email domains to include or exclude from job tracking
          </Text>

          <Group mb="md">
            <TextInput
              placeholder="example.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.currentTarget.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDomain()}
              style={{ flex: 1 }}
            />
            <Button leftSection={<IconPlus size={16} />} onClick={addDomain}>
              Add Domain
            </Button>
          </Group>

          <Stack gap="sm">
            {loading ? (
              <Text>Loading...</Text>
            ) : domains.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No domain filters configured
              </Text>
            ) : (
              domains.map((domain) => (
                <Card key={domain.id} withBorder padding="sm">
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>{domain.domain}</Text>
                      <Text size="xs" c="dimmed">
                        {domain.is_allowed ? 'Allowed' : 'Blocked'}
                      </Text>
                    </div>
                    <Group gap="sm">
                      <Switch
                        checked={domain.is_allowed}
                        onChange={() => toggleDomain(domain)}
                        label={domain.is_allowed ? 'Allow' : 'Block'}
                      />
                      <Button
                        size="sm"
                        color="red"
                        variant="subtle"
                        onClick={() => deleteDomain(domain.id)}
                      >
                        <IconTrash size={16} />
                      </Button>
                    </Group>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}