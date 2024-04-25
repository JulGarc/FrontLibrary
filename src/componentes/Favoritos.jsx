import React, {useState, useEffect} from 'react'
import { useAuth } from './Contextos/AuthContext'
import { API_URL } from '../config/config';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';


const Favoritos = () => {
    const  { token } = useAuth();
    const {decodeToken} = useAuth()
    const tokenData = decodeToken(token)
    const [favorites, setFavorites] = useState([])

    let responseData;
    let responseStatus;
    var styles = {
        cardContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          },
          card: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s',
            margin: '10px',
            width: '210px',
            heigth: '100px',
            textAlign: 'center'
          },
          cardHover: {
            transform: 'translateY(-5px)',
          },
          cardContent: {
            padding: '10px',
          },
          cardTitle: {
            margin: 0,
            fontSize: '1.2rem',
            marginTop: '5px'
          },
          cardText: {
            marginTop: '10px',
            fontSize: '1rem',
          },
          cardButton: {
            marginTop: '1px',
            marginBottom: '7px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s',
          },
          cardButtonHover: {
            backgroundColor: '#0056b3',
          }
    }

    //Validar el tipo de usuario para hacer la petición segun si es el admin o no
    const getReservations = async () => {
        try {
            const URI = `${API_URL}/favorites/user/${tokenData.auth_user_id}`
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
                console.log("respuesta: ", responseData);
                setFavorites(responseData.data.data)
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }
    
    const removeFavorite = async (favoriteId) => {
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
                getReservations()
            }

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    const removeEventHandle = (event, favoriteId) => {
        event.preventDefault();
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar este libro de tus favoritos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                removeFavorite(favoriteId)
            }
        });
    }


    useEffect(() => {
        getReservations()
    }, [])

    return (
        <div className='container' style={{ padding: '10px' }}>
            <div className="d-flex justify-content-between align-items-center" style={{ marginLeft: '35px', marginTop: '10px', marginBottom: '10px' }}>
            <h3 className="m-1"m style={{ marginLeft: '25px' }}>Mis Favoritos</h3>
            </div>
        <ul>
          {
            favorites.length >= 1 ? (
                <div style={styles.cardContainer}>
                    {favorites.map((favorite, index) => (
                        <div style={styles.card} key={index}>
                        {
                            !favorite.Book.book_cover_page || favorite.Book.book_cover_page == "" ? (
                                <img
                                    style={styles.cardImage}
                                    src="https://demofree.sirv.com/nope-not-here.jpg"
                                    alt={favorite.title}
                                />
                            ) : (<img
                                style={{height: '240px', borderRadius: '5px'}}
                                src={favorite.Book.book_cover_page}
                                alt={favorite.title}
                            />)
                        }
                        <div style={styles.cardContent}>
                            <h3 style={styles.cardTitle}>
                                {favorite.Book.book_name}
                                <a style={{ marginLeft: '13px' }} href="#" onClick={(event) => removeEventHandle(event, favorite.id)}><i className="fas fa-star"></i></a>
                            </h3>
                            <p style={styles.cardText}>{favorite.description}</p>
                            {/* <button style={styles.cardButton}>Detalles</button> */}
                            <Link to={`/Libro/detalles/${favorite.Book.id}`} className='btn btn-primary'>Detalles</Link>
                        </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <p>No tienes favoritos</p>
                </div>
            )
          }
        </ul>
      </div>
    )
}

export default Favoritos