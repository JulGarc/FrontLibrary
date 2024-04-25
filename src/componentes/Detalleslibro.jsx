import React, { useState, useEffect } from 'react'
import { useAuth } from './Contextos/AuthContext'
import { useParams } from 'react-router-dom';
import { API_URL } from "../config/config";
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';

const URI = `${API_URL}/books/details`
const RESERVATIONS_URI = `${API_URL}/reservations/user`
const FAVORITES_URI = `${API_URL}/favorites/user`

const Detalleslibro = () => {
    const { id } = useParams();
    const  { token } = useAuth();
    const {decodeToken} = useAuth()
    const tokenData = decodeToken(token)
    const reservation = true
    let responseData;
    let responseStatus;
    const [book, setBook] = useState([])

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
                console.log("respuesta: ", responseData);
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
    

    useEffect(() => {
        getBookDetails()
    }, [])

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
                            <h3 style={styles.header}> {book.title} </h3>
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
                                    <div style={styles.footerReservateContent}>
                                        <a href="#" className='btn btn-primary form-control' style={styles.reservateButton}>Reservar</a>
                                    </div>
                                ) : (
                                    <div style={styles.footerReservateContent}>
                                        <button href="#" className='btn btn-danger form-control' style={styles.reservateButton} disabled>No disponible</button>
                                    </div>
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