'use client'

import { useEffect, useState } from 'react'
import { Grid, Card, Text, Stack, Badge, Group, Title } from '@mantine/core'
import { api } from '@/lib/api'
import { notifications } from '@mantine/notifications'

interface Application {
  id: number
  company_name: string
  position: string
  status: string
  applied_date: string
  location: string | null
  salary_range: string | null
}

const STATUSES = [
  { key: 'APPLIED', label: 'Applied', color: 'blue' },
  { key: 'INTERVIEW', label: 'Interview', color: 'yellow' },
  { key: 'OFFER', label: 'Offer', color: 'green' },
  { key: 'REJECTED', label: 'Rejected', color: 'red' },
  { key: 'REPLIED', label: 'Replied', color: 'cyan' },
  { key: 'ARCHIVE', label: 'Archive', color: 'gray' },
]

export function ApplicationsKanban() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await api.get('/apps/')
      setApplications(response.data.results || response.data)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to load applications',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const getApplicationsByStatus = (status: string) => {
    return applications.filter((app) => app.status === status)
  }

  const handleDragStart = (e: React.DragEvent, applicationId: number) => {
    e.dataTransfer.setData('applicationId', applicationId.toString())
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const applicationId = parseInt(e.dataTransfer.getData('applicationId'))
    
    try {
      await api.post(`/apps/${applicationId}/update_status/`, { status: newStatus })
      notifications.show({
        title: 'Success',
        message: 'Application status updated',
        color: 'green',
      })
      fetchApplications()
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update status',
        color: 'red',
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <Grid gutter="md">
      {STATUSES.map((status) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }} key={status.key}>
          <Stack
            h="100%"
            style={{
              minHeight: '400px',
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderRadius: 'var(--mantine-radius-md)',
              padding: 'var(--mantine-spacing-md)',
            }}
            onDrop={(e) => handleDrop(e, status.key)}
            onDragOver={handleDragOver}
          >
            <Group justify="space-between" mb="sm">
              <Title order={5}>{status.label}</Title>
              <Badge color={status.color} variant="light">
                {getApplicationsByStatus(status.key).length}
              </Badge>
            </Group>
            
            {getApplicationsByStatus(status.key).map((app) => (
              <Card
                key={app.id}
                shadow="sm"
                padding="sm"
                radius="md"
                draggable
                onDragStart={(e) => handleDragStart(e, app.id)}
                style={{ cursor: 'move' }}
              >
                <Text fw={500} size="sm" lineClamp={1}>
                  {app.company_name}
                </Text>
                <Text size="xs" c="dimmed" lineClamp={1}>
                  {app.position}
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  {new Date(app.applied_date).toLocaleDateString()}
                </Text>
              </Card>
            ))}
          </Stack>
        </Grid.Col>
      ))}
    </Grid>
  )
}