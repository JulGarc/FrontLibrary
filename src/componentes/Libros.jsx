import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/config'

const Libros = () => {
    const [listaLibros, setListaLibros] = useState([])
    const [tituloLibro, setTituloLibro] = useState(null)
    const [autorLibro, setAutorLibro] = useState(null)
    useEffect(() => {
        obtenerLibros()
    }, []);

    const obtenerLibros = async () => {
        try {
            const data = {
                book_title: tituloLibro,
                book_author: autorLibro
            }
            const response = await axios.get(`${API_URL}/books`, data);
            if (response.status === 200) {
                console.log("data libros2: ", typeof response)
                setListaLibros(response.data)
            } else {
                console.log("error: ", response)
            }
        } catch (error) {
            console.error('Error de servidor', error);
        }
    }
    
    return (
        <div>
            <h1>
                Componente libros
            </h1>
        </div>
    )
}

export default Libros