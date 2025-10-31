import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

const App = () => {
  const [usuarios, setUsuarios] = useState([])
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    numeroTelefono: ''
  })
  const [editando, setEditando] = useState(false)
  const [idEditando, setIdEditando] = useState(null)

  const API_URL = 'http://localhost:8081/api/usuarios'

  // Obtener lista de usuarios
  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setUsuarios(data)
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  // Manejar cambios de inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Guardar nuevo usuario o editar existente
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nombreCompleto || !formData.correoElectronico || !formData.numeroTelefono) {
      alert('Completa todos los campos')
      return
    }

    try {
      if (editando) {
        const res = await fetch(`${API_URL}/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (res.ok) {
          alert('Usuario actualizado correctamente ✅')
          setEditando(false)
          setIdEditando(null)
        } else {
          alert('Error al actualizar usuario ❌')
        }
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (res.ok) {
          alert('Usuario creado correctamente ✅')
        } else {
          alert('Error al crear usuario ❌')
        }
      }

      setFormData({ nombreCompleto: '', correoElectronico: '', numeroTelefono: '' })
      fetchUsuarios()
    } catch (error) {
      console.error('Error al guardar:', error)
    }
  }

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      fetchUsuarios()
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
    }
  }

  const handleEdit = (usuario) => {
    setFormData({
      nombreCompleto: usuario.nombreCompleto,
      correoElectronico: usuario.correoElectronico,
      numeroTelefono: usuario.numeroTelefono
    })
    setEditando(true)
    setIdEditando(usuario.id)
  }

  const handleCancelEdit = () => {
    setFormData({ nombreCompleto: '', correoElectronico: '', numeroTelefono: '' })
    setEditando(false)
    setIdEditando(null)
  }

  return (
    <div style={{
      fontFamily: 'Arial',
      maxWidth: '700px',
      margin: '50px auto',
      textAlign: 'center'
    }}>
      <h1>Gestión de Usuarios 👤</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: '#f4f4f4',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px'
        }}
      >
        <input
          type="text"
          name="nombreCompleto"
          placeholder="Nombre completo"
          value={formData.nombreCompleto}
          onChange={handleChange}
        />
        <input
          type="email"
          name="correoElectronico"
          placeholder="Correo electrónico"
          value={formData.correoElectronico}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="numeroTelefono"
          placeholder="Número de teléfono"
          value={formData.numeroTelefono}
          onChange={handleChange}
        />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="submit"
            style={{
              background: editando ? '#ffc107' : '#007bff',
              color: '#fff',
              border: 'none',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {editando ? 'Actualizar usuario' : 'Guardar usuario'}
          </button>

          {editando && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                background: 'gray',
                color: '#fff',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2>Lista de usuarios registrados</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#007bff', color: 'white' }}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr><td colSpan="5">No hay usuarios registrados</td></tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombreCompleto}</td>
                <td>{u.correoElectronico}</td>
                <td>{u.numeroTelefono}</td>
                <td>
                  <button
                    onClick={() => handleEdit(u)}
                    style={{
                      background: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      marginRight: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    style={{
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App