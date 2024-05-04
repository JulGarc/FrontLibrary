import React, { useEffect, useState } from 'react';
import { Box, Text, Grid } from '@chakra-ui/react';
import { API_URL } from '../config/config';
import { useAuth } from './Contextos/AuthContext';
import styles from '../estilos/libros.module.css';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const FAVORITES_URI = `${API_URL}/favorites/`

const Libros = () => {
    const { token, decodeToken } = useAuth();
    const tokenData = decodeToken(token);
    const [listaLibros, setListaLibros] = useState([]);
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [mensajeReserva, setMensajeReserva] = useState('');
    const [librosReservados, setLibrosReservados] = useState([]);
    const [userReservationsArray, setUserReservationsArray] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [favorites, setFavorites] = useState([])
    const [userFavoritesArray, setUserFavoritesArray] = useState([])

    let responseData;
    let responseStatus;

    
    useEffect(() => {
        obtenerLibros();
        getUserFavorites(),
        getUserReservations();
    }, []);
    
    const obtenerLibros = async () => {
        try {
            const response = await fetch(`${API_URL}/books`);
            const datos = await response.json();
            setListaLibros(datos.data);
        } catch (error) {
            console.error('Error de servidor:', error);
        }
    };

    const filtrarLibros = (libros, filtro) => {
        return libros.filter(libro =>
            libro.title.toLowerCase().includes(filtro.toLowerCase()) ||
            libro.author.toLowerCase().includes(filtro.toLowerCase())
        );
    };

    const getUserReservations = async () => {
        const RESERVATIONS_URI = `${API_URL}/reservations`;
        try {
            const query = await fetch(`${RESERVATIONS_URI}/user/${tokenData.auth_user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            responseData = await query.json();
            responseStatus = query.status;

            if (responseStatus !== 200) {
                console.error("reserva no obtenida: ", responseData.error);
            } else {
                console.log(responseData);
                setUserReservationsArray(responseData.data.userReservationsArray);
                setReservations(responseData.data.data);
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            });
        }
    };

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


    const reservarLibro = async (idbook) => {
        try {
            const response = await fetch(`${API_URL}/reservations/create/${idbook}`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: "Libro reservado correctamente"
                });
                getUserReservations();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: responseData.error
                });
            }
        } catch (error) {
            console.error('Error de red:', error);
            setMensajeReserva('Error de red al intentar reservar el libro');
        }
    };

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

    

    return (
        <Box p={8}>
            <Text fontSize="4xl" textAlign="center" mb={8} fontWeight="bold">Biblioteca</Text>
            <div className={styles.searchBar}>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Buscar por título o autor"
                    value={filtroBusqueda}
                    onChange={(e) => setFiltroBusqueda(e.target.value)}
                />
            </div>
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={8}>
                {filtrarLibros(listaLibros, filtroBusqueda).map((libro, index) => (
                    <div key={`${libro.id}-${index}`} className={styles.libroContainer}>
                        <img className={styles.imagenLibro} src={libro.cover_page} alt={libro.title} />
                        <Box p={6}>
                            <Text className={styles.tituloLibro}>{libro.title}</Text>
                            <Text className={styles.autorLibro}>Autor: {libro.author}</Text>
                            {
                                !libro.Reservation ? (
                                    userReservationsArray.includes(libro.id) ? (
                                        <div style={styles.footerReservateContent}>
                                            <a href="#" onClick={(event) => addReservationEventHandle(event, libro.id)} className='btn btn-primary form-control' style={styles.reservateButton}>Ya resevado</a>
                                        </div>
                                    ) : (
                                        <div style={styles.footerReservateContent}>
                                            <a href="#" className='btn btn-primary form-control' style={styles.reservateButton} onClick={(event) => reservarLibro(libro.id)}>Reservar</a>
                                        </div>
                                    )
    
                                ) : (
                                    libro.Reservation.user_id === tokenData.auth_user_id ? (
                                        <div style={styles.footerReservateContent}>
                                            <button href="#" className='btn btn-success form-control' style={styles.reservateButton} disabled>Ya reservado</button>
                                        </div>
                                    ) : (<div style={styles.footerReservateContent}>
                                        <button href="#" className='btn btn-danger form-control' style={styles.reservateButton} disabled>No disponible</button>
                                    </div>)
                                )
                            }
                             {
                                    token ? (
                                        userFavoritesArray.includes(libro.id) ? (
                                            <a style={{ marginLeft: '13px' }} href="#" onClick={(event) => removeFavoriteEventHandle(event, libro.id)}><i className="fas fa-star"></i></a>
                                        ) : (
                                            <a style={{ marginLeft: '13px' }} href="#" onClick={(event) => addFavoriteEventHandle(event, libro.id)}><i className="far fa-star"></i></a>
                                        )
                                    ) : (null)
                                }
                             <p style={styles.cardText}>{libro.description}</p>
                            <Link to={`/Libro/detalles/${libro.id}`} className='btn btn-primary'>Detalles</Link>
                        </Box>
                    </div>
                ))}
            </Grid>
            {mensajeReserva && <Text mt={4} color={mensajeReserva.includes('¡') ? 'green' : 'red'}>{mensajeReserva}</Text>}
        </Box>
    );
    
}

export default Libros;
