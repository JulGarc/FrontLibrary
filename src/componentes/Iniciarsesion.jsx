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
    return(
        <div>
        <div className="container">
            <h1>Iniciar sesion.</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Iniciar sesion</button>
            </form>
        </div>
        
        </div>
    )

}

export default Iniciarsesion;
