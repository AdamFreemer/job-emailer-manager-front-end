'use client'

import { useEffect, useState } from 'react'
import { Container, Title, Text, Tabs, Stack } from '@mantine/core'
import { IconTable, IconLayoutKanban } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { ApplicationsTable } from '@/components/ApplicationsTable'
import { ApplicationsKanban } from '@/components/ApplicationsKanban'
import { DashboardHeader } from '@/components/DashboardHeader'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  has_google_account: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/user/')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Loading...</Text>
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <DashboardHeader user={user} />
        
        <Tabs defaultValue="table">
          <Tabs.List>
            <Tabs.Tab value="table" leftSection={<IconTable size={16} />}>
              Table View
            </Tabs.Tab>
            <Tabs.Tab value="kanban" leftSection={<IconLayoutKanban size={16} />}>
              Kanban View
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="table" pt="xl">
            <ApplicationsTable />
          </Tabs.Panel>

          <Tabs.Panel value="kanban" pt="xl">
            <ApplicationsKanban />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  )
}