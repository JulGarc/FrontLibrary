import React, {useState, useEffect} from 'react'
import { useAuth } from './Contextos/AuthContext'
import { API_URL } from '../config/config';
import Swal from 'sweetalert2'

const Reservaciones = () => {
    const  { token } = useAuth();
    const {decodeToken} = useAuth()
    const tokenData = decodeToken(token)
    const [reservations, setReservations] = useState([])
    const [userName, setUserName] = useState('')
    const [bookName, setBookName] = useState('')
    const [filteredReservations, setFilteredReservations] = useState([])
    const [filtersModal, setFiltersModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState(false)
    let responseData;
    let responseStatus;
    var styles = {
        tableResponsive: {
            overflowX: 'auto',
            width: '103%',
            border: '1px solid #F3F3F3',
            marginLeft: '-30px',
            textAlign: 'center'
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
        },
        tableHead: {
            backgroundColor: '#85D8ED'
        },
        tableBody: {
            textAlign: 'center'
        },
        cellStyle: {
            padding: '6px'
        }
    }

    //Validar el tipo de usuario para hacer la petición segun si es el admin o no
    const getReservations = async () => {
        let URI;
        if (tokenData.auth_role_id == 1) {
            URI = `${API_URL}/reservations`
        } else {
            URI = `${API_URL}/reservations/user/${tokenData.auth_user_id}`
        }
        try {

            const query = await fetch(`${URI}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })

            responseData = await query.json()
            responseStatus = query.status
            

            if (responseStatus != 200) {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: responseData.error
                })
            } else {
                console.log("respuesta2: ", responseData);
                if (tokenData.auth_role_id == 1) {
                    setReservations(responseData.data)
                    setFilteredReservations(responseData.data)    
                } else {
                    setReservations(responseData.data.data)
                    setFilteredReservations(responseData.data.data)
                }
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    const filterReservations = () => {
        setSearchTerm(true)

        const filtered = reservations.filter(reservation => {
            const bookNameMatch = bookName && reservation.Book.book_name.toLowerCase().includes(bookName.toLowerCase())
            const userNameMatch = userName && reservation.reservation.applicant_name.toLowerCase().includes(userName.toLowerCase())
            
            return bookNameMatch || userNameMatch
        })

        setFilteredReservations(filtered)
    }

    const toggleFiltersModal = () => {
        setFiltersModal(!filtersModal)
    }

    const clearFilters = () => {
        setSearchTerm(false)
        setFilteredReservations(reservations)
        setUserName('')
        setBookName('')
    }

    useEffect(() => {
        getReservations()
    }, [])

    const dateFormat = (date) => {
        const fecha = new Date(date);
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0
        const año = fecha.getFullYear();
        return `${dia < 10 ? '0' : ''}${dia}-${mes < 10 ? '0' : ''}${mes}-${año}`;
    }

    return (
        <div className='container' style={{ padding: '10px' }}>
            <div className="d-flex justify-content-between align-items-center" style={styles.headerContent}>
                {
                    token && tokenData.auth_role_id == 1 ? (
                        <h3 className="m-0">Lista de reservaciones vigentes</h3>
                    ) : (
                        <h3 className="m-0">Mis reservaciones vigentes</h3>
                    )
                }
                
                {
                    token && tokenData.auth_role_id == 1 ? (
                        <button className='btn btn-info' onClick={toggleFiltersModal} style={styles.filterButton}>
                            { filtersModal ? ("Ocultar filtros") : ("Mostrar filtros") }
                        </button>
                    ) : (null)
                }
            </div>
            {
                filtersModal && token && tokenData.auth_role_id == 1 ? (
                    <div>
                        <h3>Filtros</h3>
                        <div style={styles.filtersModal}>
                            <div className="row">
                                <div className="col">
                                    <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Título<span style={{ color: 'red', marginLeft: '5px' }}>*</span></label>
                                    <input type="text" className="form-control" id="book-name" value={bookName} onChange={(e) => setBookName(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                    <label htmlFor="cover_page" className="form-label">Nombre usuario</label>
                                    <input type="text" className="form-control" id="user-Name" value={userName} onChange={(e) => setUserName(e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-primary me-2" onClick={filterReservations} style={styles.filterModalButton}>Aplicar</button>
                                <button type="button" className="btn btn-primary" onClick={clearFilters} style={styles.filterModalButton}>Limpiar filtro</button>
                            </div>
                        </div>
                    </div>
                ) : (null)
            }
        <ul>
          {
            searchTerm ? (
                filteredReservations.length >= 1 ? (
                    <table style={styles.tableResponsive}>
                        <thead style={styles.tableHead}>
                            <tr>
                                <th style={styles.cellStyle}>Libro</th>
                                {
                                    token && tokenData.auth_role_id == 1 ? (<th style={styles.cellStyle}>Nombre usuario</th>) : (null)
                                }
                                {
                                    token && tokenData.auth_role_id == 1 ? (<th style={styles.cellStyle}>Correo usuario</th>) : (null)
                                }
                                <th style={styles.cellStyle}>Fecha reservación</th>
                            </tr>
                        </thead>

                        <tbody style={styles.tableBody}>
                            {
                                filteredReservations.map(reservation => (
                                    
                                    <tr key={reservation.id}>
                                        <td style={styles.cellStyle}>{reservation.Book.book_name}</td>
                                        {
                                            token && tokenData.auth_role_id == 1 ? (<td style={styles.cellStyle}>{reservation.User.applicant_name} {reservation.User.applicant_last_name}</td>) : (null)
                                        }
                                        {
                                            token && tokenData.auth_role_id == 1 ? (<td style={styles.cellStyle}>{reservation.User.applicant_email}</td>) : (null)
                                        }
                                        <td style={styles.cellStyle}>{dateFormat(reservation.createdAt)}</td>
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
                        <thead style={styles.tableHead}>
                            <tr>
                            <th style={styles.cellStyle}>Libro</th>
                                {
                                    token && tokenData.auth_role_id == 1 ? (<th style={styles.cellStyle}>Nombre usuario</th>) : (null)
                                }
                                {
                                    token && tokenData.auth_role_id == 1 ? (<th style={styles.cellStyle}>Correo usuario</th>) : (null)
                                }
                                <th style={styles.cellStyle}>Fecha reservación</th>
                            </tr>
                        </thead>

                        <tbody style={styles.tableBody}>
                        {
                                filteredReservations.map(reservation => (
                                    <tr key={reservation.id}>
                                        <td style={styles.cellStyle}>{reservation.Book.book_name}</td>
                                        {
                                            token && tokenData.auth_role_id == 1 ? (<td style={styles.cellStyle}>{reservation.User.applicant_name} {reservation.User.applicant_last_name}</td>) : (null)
                                        }
                                        {
                                            token && tokenData.auth_role_id == 1 ? (<td style={styles.cellStyle}>{reservation.User.applicant_email}</td>) : (null)
                                        }
                                        <td style={styles.cellStyle}>{dateFormat(reservation.createdAt)}</td>
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

export default Reservaciones