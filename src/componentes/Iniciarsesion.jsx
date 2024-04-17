import  React, { useState }  from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";

const URI = `${API_URL}/auth/login`;
const Iniciarsesion=()=>{

    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[error,setError]=useState('');
    const navigate = useNavigate();

    const handleSubmit =async(e)=>{
        e.preventDefault();

        try {
            const response=await axios.post(URI,{
            email,
            password
            });
            if (response.status === 200) {
                navigate('/');
            } else {
                setError('Error al crear el usuario');
            }   
        } catch (error) {
            setError('error al iniciar sesion')
            console.log('Error al iniciar sesion', error)
        }
    }
    return(
        <div>
        <div className="container">
            <h1>Iniciar sesion.</h1>
            {error && <div className="alert alert-danger">{error}</div>}
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
