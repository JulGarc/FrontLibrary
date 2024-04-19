import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/config'
import { useAuth } from './Contextos/AuthContext'

const Libros = () => {
    const { token } = useAuth();
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
          <h1>Componente libros</h1>
          {token ? (
            <>
              <div key={1}><p>Usuario autenticado. Token: {token}</p></div>
              {/* <div key={2}><p>Data del token: {tokenData}</p></div> */}
            </>
          ) : (
            <p>Usuario no autenticado.</p>
          )}
        </div>
      );      
}

export default Libros