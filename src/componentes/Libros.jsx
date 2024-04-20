import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/config'
import { useAuth } from './Contextos/AuthContext'

const Libros = () => {
    const { token } = useAuth()
    const {decodeToken} = useAuth()
    const tokenData = decodeToken(token)
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
        <div className='container' style={{ justifyContent: 'center', alignItems: 'center'}}>
          <h1>Componente libros</h1>
          {token ? (
            <>
              <div key={1}><p>Usuario autenticado. Token: {token}</p></div>
              <div key={2}><p>Id de usuario: {tokenData.auth_user_id}</p></div>
              <div key={3}><p>Rol de usuario: {tokenData.auth_role_id}</p></div>
              <div key={4}><p>Emisión del token: {tokenData.auth_token_iat}</p></div>
              <div key={5}><p>Expiración del token: {tokenData.auth_token_exp}</p></div>
            </>
          ) : (
            <p>Usuario no autenticado.</p>
          )}
        </div>
      );      
}

export default Libros