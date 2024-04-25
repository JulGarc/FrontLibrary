import React, { useState } from "react";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";

const URI = `${API_URL}/users/signup`;

const Registrarse = () => {
    const [name, setName] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    var responseData;
    var responseStatus;
    // Procedimiento pa guardar
    const store = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) { 
            //validar las password
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: "Las contraseñas no coinciden"
            })
        }
        try {
            const data2 = {
                name: name, 
                last_name: last_name,
                email: email,
                password: password,
                password_confirmation: confirmPassword
            }
            const response = await fetch(URI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data2)
            });
            responseData = await response.json();
            responseStatus = response.status

            if (responseStatus == 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'ÉXITO',
                    text: "Registro completado con éxito"
                })
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
    };

    return (
        <div className="container">
            <h1>Registrarse</h1>
            <form onSubmit={store}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">Apellido</label>
                    <input type="text" className="form-control" id="last_name" value={last_name} onChange={(e) => setLast_name(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                    <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Crear</button>
            </form>
        </div>
    );
};

export default Registrarse;
