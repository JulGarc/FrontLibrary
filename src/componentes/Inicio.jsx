import React, { useState, useEffect } from "react";
import { API_URL } from '../config/config';

const Inicio = () => {
    const [listaLibros, setListaLibros] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const obtenerLibros = async () => {
        try {
            const response = await fetch(`${API_URL}/books`);
            const datos = await response.json();
            setListaLibros(datos.data);
        } catch (error) {
            console.error('Error de servidor:', error);
        }
    };

    useEffect(() => {
        obtenerLibros();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex =>
                prevIndex === listaLibros.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);
        return () => clearInterval(interval);
    }, [listaLibros]);

    const styles = {
        container: {
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px',
            marginBottom: '20px',
        },
        main: {
            marginBottom: '20px',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
        },
        sidebar: {
            width: '30%',
            backgroundColor: '#f0f0f0',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginRight: '0px',
            marginLeft: '50px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FFF5B3',
            borderRadius: '50px 5px 50px 5px',
            height: '70vh',
            width: '60%',
            textAlign: 'center'
        },
        featuredBooks: {
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '0px',
            marginLeft: '50px',
            position: 'relative',
            overflow: 'hidden',
            height: '70vh',
            width: '30%',
            textAlign: 'center'
        },
        slider: {
            display: 'flex',
            transition: 'transform 0.8s ease-in-out',
            transform: `translateX(-${currentIndex * 100}%)`,
        },
        slide: {
            textAlign: 'center',
            position: 'relative',
            minWidth: '100%',
            height: '350px',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        },
        bookTitle: {
            position: 'absolute',
            bottom: '10px',
            left: '0',
            width: '100%',
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '5px',
            borderRadius: '0 0 5px 5px',
        },
        footer: {
            backgroundColor: '#333',
            color: '#fff',
            padding: '5px',
            marginTop: '32px'
        }
    };

    return (
        <div style={styles.container}>
            <br />
            <main style={styles.main}>
                <div style={styles.sidebar}>
                    <h3>BIBLIOTECA</h3>
                    <br />
                    <h4>
                        ¡Bienvenido!
                    </h4>
                    <br />
                    <p>
                    En nuestra biblioteca en línea, las puertas del conocimiento están siempre abiertas para ti.
                    Únete a nosotros y descubre un mundo de posibilidades, donde cada libro es una oportunidad
                    para aprender, crecer y soñar.
                    </p>
                </div>
                <section style={styles.featuredBooks}>
                    <h3>Libros Destacados</h3>
                    {listaLibros.length > 0 && (
                        <div className="slider" style={styles.slider}>
                            {listaLibros.map((libro, index) => (
                                <div
                                    key={index}
                                    className="slide"
                                    style={{
                                        ...styles.slide,
                                        backgroundImage: `url(${libro.cover_page})`,
                                        opacity: index === currentIndex ? 1 : 0,
                                        transition: 'opacity 1s ease-in-out',
                                    }}
                                >
                                    <div style={styles.bookTitle}>{libro.title}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <footer style={styles.footer}>
                <p>&copy; {new Date().getFullYear()} Biblioteca</p>
            </footer>
        </div>
    );
};

export default Inicio;
