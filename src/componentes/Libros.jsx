import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Libros = () => {
    const [listaLibros, setListaLibros] = useState([])
    const [tituloLibro, setTituloLibro] = useState(null)
    const [autorLibro, setAutorLibro] = useState(null)
    const URI ='http://localhost:3000/api/v1/books'
    useEffect(() => {
        obtenerLibros()
    }, []);

    const obtenerLibros = async () => {
        try {
            const data = {
                book_title: tituloLibro,
                book_author: autorLibro
            }
            const response = await axios.get(URI, data);
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
        <div className="card-grid">
      {listaLibros.map((item, index) => (
        <div className="card" key={index}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
    )
}

export default Libros