'use client'

import { useEffect, useState } from 'react'
import { Table, Badge, Button, Group, TextInput, Select } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
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
  job_posting_url: string | null
  notes: string | null
}

const STATUS_COLORS: Record<string, string> = {
  APPLIED: 'blue',
  INTERVIEW: 'yellow',
  OFFER: 'green',
  REJECTED: 'red',
  ARCHIVE: 'gray',
  REPLIED: 'cyan',
}

export function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [search, statusFilter])

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter) params.append('status', statusFilter)

      const response = await api.get(`/apps/?${params}`)
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

  const updateApplicationStatus = async (id: number, newStatus: string) => {
    try {
      await api.post(`/apps/${id}/update_status/`, { status: newStatus })
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

  const rows = applications.map((app) => (
    <Table.Tr key={app.id}>
      <Table.Td>{app.company_name}</Table.Td>
      <Table.Td>{app.position}</Table.Td>
      <Table.Td>
        <Badge color={STATUS_COLORS[app.status] || 'gray'}>
          {app.status}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(app.applied_date).toLocaleDateString()}</Table.Td>
      <Table.Td>{app.location || '-'}</Table.Td>
      <Table.Td>
        <Select
          size="xs"
          value={app.status}
          onChange={(value) => value && updateApplicationStatus(app.id, value)}
          data={[
            { value: 'APPLIED', label: 'Applied' },
            { value: 'INTERVIEW', label: 'Interview' },
            { value: 'OFFER', label: 'Offer' },
            { value: 'REJECTED', label: 'Rejected' },
            { value: 'ARCHIVE', label: 'Archive' },
            { value: 'REPLIED', label: 'Replied' },
          ]}
        />
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <div>
      <Group mb="md" justify="space-between">
        <TextInput
          placeholder="Search applications..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Filter by status"
          clearable
          value={statusFilter}
          onChange={setStatusFilter}
          data={[
            { value: 'APPLIED', label: 'Applied' },
            { value: 'INTERVIEW', label: 'Interview' },
            { value: 'OFFER', label: 'Offer' },
            { value: 'REJECTED', label: 'Rejected' },
            { value: 'ARCHIVE', label: 'Archive' },
            { value: 'REPLIED', label: 'Replied' },
          ]}
        />
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Company</Table.Th>
            <Table.Th>Position</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Applied Date</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.Tr>
              <Table.Td colSpan={6} style={{ textAlign: 'center' }}>
                Loading...
              </Table.Td>
            </Table.Tr>
          ) : rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={6} style={{ textAlign: 'center' }}>
                No applications found
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </div>
  )
}