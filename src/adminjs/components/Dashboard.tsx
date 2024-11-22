// src/adminjs/components/Dashboard.tsx
import React, { useEffect, useState } from 'react'
// @ts-ignore
import { H1, H2, Table, TableHead, TableBody, TableRow, TableCell } from '@adminjs/design-system'
import { ApiClient, useCurrentAdmin } from 'adminjs'


interface DashboardData {
    Cursos: number;
    Episódios: number;
    Categorias: number;
    Usuários: number;
}

export default function Dashboard() {
  const [resources, setResources] = useState<DashboardData>()
  const [currentAdmin] = useCurrentAdmin()
  const api = new ApiClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    const res = await api.getDashboard()
    console.log(res.data)

    // @ts-ignore
    setResources(res.data)
  }

  return (
    <section style={{ padding: '1.5rem' }}>
      <H1>Seja bem-vindo(a), {currentAdmin?.firstName}!</H1>

      <section style={{ backgroundColor: '#FFF', padding: '1.5rem' }}>
        <H2>Resumo</H2>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#FF0043' }}>
              <TableCell style={{ color: "#FFF" }}>Recurso</TableCell>
              <TableCell style={{ color: "#FFF" }}>Registros</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              resources ?
                Object.entries(resources).map(([resource, count]) => (
                  <TableRow key={resource}>
                    <TableCell>{resource}</TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))
                :
                <></>
            }
          </TableBody>
        </Table>
      </section>
    </section>
  )
}