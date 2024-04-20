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

    var responseData
    var responseStatus

    var styles = {
        tableResponsive: {
            overflowX: 'auto',
            width: '100%'
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

    const clearFilters = () => {
        setSearchTerm(false)
        setFilteredUsers([])
    }

    return (
        <div className='container'>
        <h1>Usuarios</h1>
            <div>
                <h3>Filtros</h3>
                <div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Nombre<span style={{ color: 'red', marginLeft: '5px' }}>*</span></label>
                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cover_page" className="form-label">Apellido</label>
                    <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="year" className="form-label">Correo</label>
                    <input type="text" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <button type="button" className="btn btn-primary form-control mb-2" onClick={filterUsers}>Filtrar</button>
                <button type="button" className="btn btn-primary form-control" onClick={clearFilters}>Limpiar filtro</button>
                </div>
            </div>
        <ul>
          {
            searchTerm ? (
                filteredUsers.length >= 1 ? (
                    <table>
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
                ) : (<p>No se hallaron coincidencias</p>)
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