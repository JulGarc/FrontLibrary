import React, {useState, useEffect} from 'react'
import { useAuth } from './Contextos/AuthContext'
import { API_URL } from '../config/config';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';

const LoadingScreen = () => {
    return (
        <div style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        }}>
            <div style={{ color: 'white', fontSize: '24px' }}>Cargando...</div>
        </div>
    );
};

const Favoritos = () => {
    const  { token } = useAuth();
    const {decodeToken} = useAuth()
    const tokenData = decodeToken(token)
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true);

    let responseData;
    let responseStatus;
   

    var styles = {
        cardContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            marginLeft: '-50px',
            width: '110%',
            height: '400px',
            overflowY: 'auto', // Hace el contenedor scrollable en dirección vertical
            maxHeight: 'calc(100vh - 20px)', // Altura máxima igual a la altura de la ventana menos 100px
            padding: '10px', // Añade un espacio interno para el scroll
            scrollbarColor: 'lightgray transparent',
        },
        card: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s',
            margin: '5px',
            width: '220px',
            heigth: '240px', // Corregí la propiedad 'heigth' a 'height'
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
        },
        titleHeader: {
            marginTop: '15px',
            marginBottom: '15px',
            textAlign: 'center',
            padding: '5px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FFF5B3',
            borderRadius: '50px 5px 50px 5px',
        },
        nonReservationContent: {
            marginTop: '50px',
            marginBottom: '15px',
            padding: '5px',
            textAlign: 'center',
            width: '102%',
            fontSize: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #FFF5B3',
            borderRadius: '5px 5px 5px 5px',
            marginLeft: '-30px'
        },
        notFoundImage: {
            height: '280px',
            opacity: '0.2'
        }
    }
    
    const getFavorites = async () => {
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
            

            if (responseStatus == 200) {
                console.log("respuesta: ", responseData);
                setFavorites(responseData.data.data)
                setLoading(false)
            } else if(responseStatus == 404) {
                setFavorites([])
                setLoading(false)
            } else {
                console.log("error favoritos: ", responseData.error)
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
                });
                getFavorites()
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
        getFavorites()
    }, [])

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className='container' style={{ padding: '10px' }}>
            <div style={styles.titleHeader}>
                <h3>Mis Favoritos</h3>
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
                            <Link to={`/Libro/detalles/${favorite.Book.id}`} className='btn btn-primary'>Detalles</Link>
                        </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={styles.nonReservationContent}>
                    <p>Todavía no tienes favoritos</p>
                    <img style={styles.notFoundImage} src="https://cdn-icons-png.flaticon.com/512/1178/1178479.png" alt="" />
                </div>
            )
          }
        </ul>
      </div>
    )
}

export default Favoritos