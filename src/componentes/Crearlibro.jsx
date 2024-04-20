import React, { useState } from 'react'
import { useAuth } from './Contextos/AuthContext'
import { API_URL } from '../config/config';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const URI = `${API_URL}/books/create`

const Crearlibro = () => {
    const  { token } = useAuth();
    const {decodeToken} = useAuth()
    const tokenData = decodeToken(token)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [description, setDescription] = useState('')
    const [coverPage, setCoverPage] = useState('')
    const [year, setYear] = useState('')
    var responseData
    var responseStatus

    const store = async(e) => {
        e.preventDefault()

        const request = {
            title, 
            author, 
            description, 
            year, 
            cover_page: coverPage,
            state: 1
        }

        try {
            const query = await fetch(URI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(request)
            })
    
            responseData = await query.json()
            responseStatus = query.status
    
            if (responseStatus != 201) {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: responseData.error
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'ÉXITO',
                    text: "Libro creado con éxito"
                })

                setTitle('')
                setAuthor('')
                setDescription('')
                setCoverPage('')
                setYear('')
            }
        } catch (err) {
            Swal.fire({
                icon: 'danger',
                title: 'Ocurrió un error inesperado',
                text: err.message
            })
        }
    }
    return (
        <div className='container'>
            <h1>Crear Libro</h1>
            <form onSubmit={store}>
            <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título<span style={{ color: 'red', marginLeft: '5px' }}>*</span></label>
                    <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="author" className="form-label">Autor<span style={{ color: 'red', marginLeft: '5px' }}>*</span></label>
                    <input type="text" className="form-control" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción<span style={{ color: 'red', marginLeft: '5px' }}>*</span></label>
                    <textarea type="text" className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cover_page" className="form-label">URL de portada</label>
                    <input type="text" className="form-control" id="coverPage" value={coverPage} onChange={(e) => setCoverPage(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="year" className="form-label">Año de lanzamiento</label>
                    <input type="number" className="form-control" id="year" value={year} onChange={(e) => setYear(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary form-control">Crear</button>
            </form>
        </div>
    )
}

export default Crearlibro