import React, {useState, useEffect} from 'react'
import { useAuth } from './Contextos/AuthContext'
import { API_URL } from '../config/config';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const URI = `${API_URL}/users`

const Usuarios = () => {
    const  { token } = useAuth();
    const {decodeToken} = useAuth()
    const tokenData = decodeToken(token)
    const [name, setName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [email, setEmail] = useState(null)
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState(false)
    const [filteredUsers, setFilteredUsers] = useState([])
    const [filtersModal, setFiltersModal] = useState(false)

    var responseData
    var responseStatus

    var styles = {
        tableResponsive: {
            overflowX: 'auto',
            width: '100%'
        },
        filterButton: {
            width: '200px'
        },
        headerContent: {
            marginTop: '15px',
            marginBottom: '15px',
            paddingBottom: '15px'
        },
        filterModalButton: {
            width: '25%'
        },
        filtersModal: {
            paddingBottom: '15px'
        }
    }

    const getUsers = async() => {
        try {
            const query = await fetch(`${URI}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            console.log("query: ", query);
            responseData = await query.json()
            responseStatus = query.status
            if (responseStatus != 200) {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: responseData.error
                })
            } else {
                setUsers(responseData.data)
                setFilteredUsers(responseData.data)
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    const filterUsers = () => {
        setSearchTerm(true)

        const filtered = users.filter(user => {
            const nameMatch = name && user.name.toLowerCase().includes(name.toLowerCase());
            const lastNameMatch = lastName && user.last_name.toLowerCase().includes(lastName.toLowerCase());
            const emailMatch = email && user.email.toLowerCase().includes(email.toLowerCase())
            
            return nameMatch || lastNameMatch || emailMatch;
          });
        setFilteredUsers(filtered);

    }

    const toggleFiltersModal = () => {
        setFiltersModal(!filtersModal)
    }

    const clearFilters = () => {
        setSearchTerm(false)
        setFilteredUsers(users)
        setName('')
        setLastName('')
        setEmail('')
    }

    return (
        <div className='container'>
            <div className="d-flex justify-content-between align-items-center" style={styles.headerContent}>
                <h1 className="m-0">Lista de Usuarios</h1>
                <button className='btn btn-info' onClick={toggleFiltersModal} style={styles.filterButton}>
                    {
                        filtersModal ? ("Ocultar filtros") : ("Mostrar filtros")
                    }
                </button>
            </div>
            {
                filtersModal ? (
                    <div>
                        <h3>Filtros</h3>
                        <div style={styles.filtersModal}>
                            <div className="row">
                                <div className="col">
                                    <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Nombre<span style={{ color: 'red', marginLeft: '5px' }}>*</span></label>
                                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                    <label htmlFor="cover_page" className="form-label">Apellido</label>
                                    <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                    <label htmlFor="year" className="form-label">Correo</label>
                                    <input type="text" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-primary me-2" onClick={filterUsers} style={styles.filterModalButton}>Aplicar</button>
                                <button type="button" className="btn btn-primary" onClick={clearFilters} style={styles.filterModalButton}>Limpiar filtro</button>
                            </div>
                        </div>
                    </div>
                ) : (null)
            }
        <ul>
          {
            searchTerm ? (
                filteredUsers.length >= 1 ? (
                    <table style={styles.tableResponsive}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Correo</th>
                                <th>Estado</th>
                                <th>Rol</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {
                                                user.role_id == 1 ? ("Admin") : ("Cliente")
                                            }
                                        </td>
                                        <td>
                                            {
                                                user.state == 1 ? ("Activo") : ("Inactivo")
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <p>No se hallaron coincidencias</p>
                    </div>
                )
            ) : (
                <table style={styles.tableResponsive}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Correo</th>
                                <th>Estado</th>
                                <th>Rol</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {
                                                user.role_id == 1 ? ("Admin") : ("Cliente")
                                            }
                                        </td>
                                        <td>
                                            {
                                                user.state == 1 ? ("Activo") : ("Inactivo")
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            )
          }
        </ul>
      </div>
    )
}

export default Usuarios