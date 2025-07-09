import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterUser, setFilterUser] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('Exchange_users_invoices')
        .select('*')

      if (error) {
        console.error('Ошибка при загрузке данных:', error)
      } else {
        setData(data)
        setFilteredData(data)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filtered = data.filter(item =>
      item.user_name.toLowerCase().includes(filterUser.toLowerCase())
    )
    setFilteredData(filtered)
  }, [filterUser, data])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[key]
      const bValue = b[key]

      if (aValue == null) return 1
      if (bValue == null) return -1

      if (typeof aValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })

    setFilteredData(sorted)
    setSortConfig({ key, direction })
  }

  // Стили для заголовков
  const tableHeaderStyle = {
    background: '#f0f0f0',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
    padding: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textAlign: 'left',
    transition: 'all 0.2s ease-in-out'
  }

  const activeSortStyle = {
    background: '#e0e0e0',
    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.8)'
  }

  const th = (label, key) => (
    <th
      onClick={() => handleSort(key)}
      style={{
        ...tableHeaderStyle,
        ...(sortConfig.key === key ? activeSortStyle : {})
      }}
    >
      {label}
    </th>
  )

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Данные из Supabase</h1>

      <input
        type="text"
        placeholder="Фильтр по пользователю"
        value={filterUser}
        onChange={(e) => setFilterUser(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {th('ID', 'id')}
              {th('Дата', 'date_time')}
              {th('Пользователь', 'user_name')}
              {th('₽', 'rub')}
              {th('Крипта', 'total_crypto')}
              {th('Тип', 'paymentMethodName')}
              {th('Реквизиты', 'requisites')}
              {th('ФИО', 'holder')}
              {th('Статус', 'status')}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{new Date(item.date_time).toLocaleString()}</td>
                <td>{item.user_name}</td>
                <td>{item.rub}</td>
                <td>{item.total_crypto} {item.type_crypto}</td>
                <td>{item.paymentMethodName} / {item.paymentOption}</td>
                <td>{item.requisites}</td>
                <td>{item.holder}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
