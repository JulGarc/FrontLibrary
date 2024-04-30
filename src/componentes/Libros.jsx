import React, { useEffect, useState } from 'react';
import { Box, Text, Grid } from '@chakra-ui/react';
import { API_URL } from '../config/config';
import { useAuth } from './Contextos/AuthContext';
import styles from '../estilos/libros.module.css'; 

const Libros = () => {
    const { token, decodeToken } = useAuth();
    const tokenData = decodeToken(token);
    const [listaLibros, setListaLibros] = useState([]);

    useEffect(() => {
        obtenerLibros();
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

    return (
        <Box p={8}>
            <Text fontSize="4xl" textAlign="center" mb={8} fontWeight="bold">Biblioteca</Text>
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={8}>
                {listaLibros.map(libro => (
                    <div key={libro.id} className={styles.libroContainer}> {/* Aplica la clase de estilo CSS */}
                        <img className={styles.imagenLibro} src={libro.cover_page} alt={libro.title} />
                        <Box p={6}>
                            <Text className={styles.tituloLibro}>{libro.title}</Text>
                            <Text className={styles.autorLibro}>Autor: {libro.author}</Text>
                            <button className={styles.buttonLibro} disabled={libro.Reservations?.length > 0}>
                                {libro.Reservations?.length > 0 ? "No disponible" : "Reservar"}
                            </button>
                        </Box>
                    </div>
                ))}
            </Grid>
        </Box>
    );
}

export default Libros;
