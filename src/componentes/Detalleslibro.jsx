import React, { useState, useEffect } from 'react'
import { useAuth } from './Contextos/AuthContext'
import { useParams } from 'react-router-dom';
import { API_URL } from "../config/config";
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';

const URI = `${API_URL}/books/details`
const RESERVATIONS_URI = `${API_URL}/reservations`
const FAVORITES_URI = `${API_URL}/favorites/`

const Detalleslibro = () => {
    const { id } = useParams();
    const  { token } = useAuth();
    const {decodeToken} = useAuth()
    const tokenData = decodeToken(token)
    const reservation = true
    let responseData;
    let responseStatus;
    const [book, setBook] = useState([])
    const [favorites, setFavorites] = useState([])
    const [userFavoritesArray, setUserFavoritesArray] = useState([])
    const [reservations, setReservations] = useState([])
    const [userReservationsArray, setUserReservationsArray] = useState([])

    const getBookDetails = async () => {
        try {
            const query = await fetch(`${URI}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
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
                setBook(responseData.data)
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    const reservateBook = async (BookId) => {
        try {
            const query = await fetch(`${RESERVATIONS_URI}/create/${BookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })

            responseData = await query.json()
            responseStatus = query.status
            

            if (responseStatus != 201) {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: responseData.error
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'ÉXITO',
                    text: "Libro reservado con éxito"
                })
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    const getUserFavorites = async () => {
        try {
            const query = await fetch(`${FAVORITES_URI}user/${tokenData.auth_user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })

            responseData = await query.json()
            responseStatus = query.status
            

            if (responseStatus != 200) {
                console.error("favoritos no obtenidos: ", responseData.error)
            } else {
                setUserFavoritesArray(responseData.data.userFavoritesArray)
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    const getUserReservations = async () => {
        try {
            const query = await fetch(`${RESERVATIONS_URI}/user/${tokenData.auth_user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })

            responseData = await query.json()
            responseStatus = query.status
            

            if (responseStatus != 200) {
                console.error("favoritos no obtenidos: ", responseData.error)
            } else {
                setUserReservationsArray(responseData.data.userReservationsArray)
                setReservations(responseData.data.data)
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    const removeFavorite = async (bookId) => {
        let favoriteId;
        for (const key in favorites) {
            if (favorites.hasOwnProperty(key) && favorites[key].book_id === bookId) {
                favoriteId = favorites[key].id
            }
            
        }
        try {
            const URI = `${API_URL}/favorites/delete/${favoriteId}`
            const query = await fetch(`${URI}`, {
                method: 'POST',
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
                Swal.fire({
                    icon: 'success',
                    title: 'ÉXITO',
                    text: 'Favorito eliminado correctamente'
                })
                getUserFavorites()
            }

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    const addFavoriteEventHandle = (event, bookId) => {
        event.preventDefault();
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Añadir este libro a tus favoritos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                addToFavorites(bookId)
            }
        });
    }

    const addToFavorites = async (BookId) => {
        try {
            const query = await fetch(`${FAVORITES_URI}/create/${BookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })

            responseData = await query.json()
            responseStatus = query.status
            

            if (responseStatus != 201) {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: responseData.error
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'ÉXITO',
                    text: "Libro añadido a favoritos"
                })
                getUserFavorites()
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    const removeFavoriteEventHandle = (event, bookId) => {
        event.preventDefault();
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Eliminar este libro de tus favoritos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                removeFavorite(bookId)
            }
        });
    }

    const addReservationEventHandle = (event, bookId) => {
        event.preventDefault();
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Reservar este libro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                reservateBook(bookId)
            }
        });
    }
    

    useEffect(() => {
        if (token) {
            getUserFavorites(),
            getUserReservations()
        }
        getBookDetails()
    }, [])

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
        },
        detailsContainer: {
            flex: '1',
            marginLeft: '15px',
            marginTop: '40px'
        },
        header: {
            textAlign: 'center',
        },
        label: {
            fontWeight: 'bold',
        },
        text: {
            textAlign: 'justify',
            marginBottom: '10px'
        },
        imageContainer: {
            flex: '1',
            marginRight: '10px',
            minWidth: '420px',
        },
        image: {
            width: '100%',
            height: '500px',
            maxWidth: 'calc(100% - 20px)',
            marginTop: '25px',
        },
        footerContent: {
            border: '1px solid #85D8ED',
            padding: '6px',
            borderRadius: '5px',
            height: '125px',
            marginBottom: '15px'
        },
        footerReservateContent: {
            padding: '6px',
            borderRadius: '5px',
            height: '125px',
            marginBottom: '15px',
            textAlign: 'center'
        },
        reservateButton: {
            marginTop: '70px',
            fontSize: '22px'
        }

    };

    return (
        <div className='container' style={styles.container}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={styles.imageContainer}>
                    <img
                        src={book.cover_page}
                        alt="Imagen"
                        style={styles.image}
                    />
                </div>
                <div style={styles.detailsContainer}>
                    <form style={{ width: '100%' }} /* onSubmit={updateUserHandle} */>
                        <div style={styles.header}>
                            <h3 style={styles.header}>
                                {book.title}
                                {
                                    token ? (
                                        userFavoritesArray.includes(book.id) ? (
                                            <a style={{ marginLeft: '13px' }} href="#" onClick={(event) => removeFavoriteEventHandle(event, book.id)}><i className="fas fa-star"></i></a>
                                        ) : (
                                            <a style={{ marginLeft: '13px' }} href="#" onClick={(event) => addFavoriteEventHandle(event, book.id)}><i className="far fa-star"></i></a>
                                        )
                                    ) : (null)
                                }
                            </h3>
                        </div>
                        <strong><label style={styles.label}> Sinopsis. </label></strong>

                        <textarea
                            id="myTextarea"
                            rows={6}
                            cols={70}
                            value={book.description}
                            style={{ 
                                resize: 'none',
                                border: 'none',
                                outline: 'none',
                                overflowX: 'hidden',
                                overflowY: 'scroll',
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'lightgray transparent',
                                textAlign: 'justify',
                                paddingRight: '10px'
                            }}
                        />
                        <br />
                        <strong><label style={styles.label}> Autor. </label></strong>
                        <br />
                        <label htmlFor="" style={styles.text}> {book.author} </label>

                        <br />

                        <strong><label style={styles.label}> Año de publicación. </label></strong>
                        <br />
                        <label htmlFor="" style={styles.text}> {book.year} </label> 
                        <br />
                        <br />
                        {
                            !token ? (
                                <div style={styles.footerContent}>
                                    <strong><label htmlFor="" style={{ display: 'block', textAlign: 'center', fontSize: '18px' }}>¿Quieres tener acceso a este título?</label></strong>
                                    <label htmlFor="" style={{ display: 'block', textAlign: 'center', fontSize: '16px' }}>
                                        Inicia sesión o regístrate para tener acceso a este y más libros de nuestro catálogo
                                    </label>
                                    <div style={{ display: 'flex', width: '80%', marginLeft: '50px' }}>
                                        <Link className='btn btn-primary btn-sm' style={{ flex: '1', marginRight: '5px' }} to={'/Iniciarsesion'}>Iniciar sesión</Link>
                                        <Link className='btn btn-info btn-sm' style={{ flex: '1', marginLeft: '5px' }} to={'/Registrarse'}>Registrarse</Link>
                                    </div>
                                </div>
                            ) : (
                                !book.Reservation ? (
                                    userReservationsArray.includes(book.id) ? (
                                        <div style={styles.footerReservateContent}>
                                            <a href="#" onClick={(event) => addReservationEventHandle(event, book.id)} className='btn btn-primary form-control' style={styles.reservateButton}>Devolver</a>
                                        </div>
                                    ) : (
                                        <div style={styles.footerReservateContent}>
                                            {/* <a href="#" className='btn btn-primary form-control' style={styles.reservateButton}>Reservar</a> */}
                                            <a href="#" className='btn btn-primary form-control' style={styles.reservateButton} onClick={(event) => addReservationEventHandle(event, book.id)}>Reservar</a>
                                        </div> 
                                    )
                                    
                                ) : (
                                    book.Reservation.user_id == tokenData.auth_user_id ? (
                                        <div style={styles.footerReservateContent}>
                                        <button href="#" className='btn btn-danger form-control' style={styles.reservateButton} disabled>Ya reservado</button>
                                    </div>
                                    ) : (<div style={styles.footerReservateContent}>
                                        <button href="#" className='btn btn-danger form-control' style={styles.reservateButton} disabled>No disponible</button>
                                    </div>)
                                )
                            )
                        }
                    </form>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Detalleslibro