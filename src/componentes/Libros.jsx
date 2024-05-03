import React, { useEffect, useState } from 'react';
import { Box, Text, Grid } from '@chakra-ui/react';
import { API_URL } from '../config/config';
import { useAuth } from './Contextos/AuthContext';
import styles from '../estilos/libros.module.css';

const Libros = () => {
    const { token, decodeToken } = useAuth();
    const tokenData = decodeToken(token);
    const [listaLibros, setListaLibros] = useState([]);
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [mensajeReserva, setMensajeReserva] = useState('');
    const [librosReservados, setLibrosReservados] = useState([]);

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

    const filtrarLibros = (libros, filtro) => {
        return libros.filter(libro =>
            libro.title.toLowerCase().includes(filtro.toLowerCase()) ||
            libro.author.toLowerCase().includes(filtro.toLowerCase())
        );
    };

    const reservarLibro = async (idbook) => {
        try {
            const response = await fetch(`${API_URL}/reservations/create/${idbook}`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token 
                },
                body: JSON.stringify({ user_id: tokenData.id }) 
            });
            const data = await response.json();
            if (response.ok) {
                setMensajeReserva('¡Libro reservado exitosamente!');
                // Agregar el ID del libro reservado a la lista de libros reservados
                setLibrosReservados([...librosReservados, idbook]);
            } else {
                setMensajeReserva(data.message || 'Error al reservar el libro');
            }
        } catch (error) {
            console.error('Error de red:', error);
            setMensajeReserva('Error de red al intentar reservar el libro');
        }
    };

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
                        <button
                            className={styles.buttonLibro}
                            disabled={librosReservados.includes(libro.id)} // Deshabilitar si el libro está en la lista de reservados
                            onClick={() => reservarLibro(libro.id)}
                        >
                            {librosReservados.includes(libro.id) ? "No disponible" : "Reservar"}
                        </button>
                    </Box>
                </div>
            ))}
            </Grid>
            {mensajeReserva && <Text mt={4} color={mensajeReserva.includes('¡') ? 'green' : 'red'}>{mensajeReserva}</Text>}
        </Box>
    );
}

export default Libros;
