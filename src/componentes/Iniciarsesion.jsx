import  React, { useState }  from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";
import { useAuth } from "./Contextos/AuthContext";
import Swal from 'sweetalert2'

const URI = `${API_URL}/auth/signin`;
const Iniciarsesion=()=>{
    const {login} = useAuth();
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[error,setError]=useState('');
    const navigate = useNavigate();
    var responseData;
    var responseStatus;
    const handleSubmit =async(e)=>{
        e.preventDefault();

        try {
            const request = { email, password }
            
            const response = await fetch(URI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            responseData = await response.json()
            responseStatus = response.status

            if (responseStatus == 200) {
                const token = responseData['data']['token']
                login(token)
                navigate('/Libros');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: responseData.error
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: error.message
            })
        }
    }

    const styles = {
        titleHeader: {
            marginTop: '15px',
            marginBottom: '15px',
            textAlign: 'center',
            padding: '5px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FFF5B3',
            borderRadius: '50px 5px 50px 5px',
        },
        divContainer: {
            display: 'flex',
            flexDirection: 'row-reverse',
            width: '100%'
        },
        formContent: {
            flex: '1',
            marginTop: '50px',
            fontSize: '18px',
            padding: '30px',
            height: '300px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FFF5B3',
            borderRadius: '10px 10px 10px 10px',
        },
        image: {
            width: '100%',
            height: '420px',
            border: '2px solid #FFF5B3',
            borderRadius: '10px 10px 10px 10px',
        },
        imgContainer: {
            flex: '1',
            textAlign: 'center',
            marginRight: '20px'
        },
        container: {
            height: '90.7vh', // Establece el alto del contenedor al 100% del alto de la ventana
            display: 'flex',
            flexDirection: 'column',
        },
    }
    return(
        <div className="container" style={styles.container}>
            <div style={styles.titleHeader}>
                <h3>Iniciar sesión</h3>
            </div>
            <div style={styles.divContainer}>
                <div style={styles.formContent}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3" style={{ marginTop: '0px' }}>
                        <label htmlFor="email" className="form-label">Correo</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <br />
                    <button type="submit" className="btn btn-primary form-control">Iniciar sesión</button>
                </form>
                </div>

                <div style={styles.imgContainer}>
                    <img src="https://c4.wallpaperflare.com/wallpaper/89/796/11/book-reading-backgrounds-inspiration-download-3840x2400-book-wallpaper-preview.jpg" alt="imagen" style={styles.image} />
                </div>
            </div>
        </div>
    )

}

export default Iniciarsesion;
