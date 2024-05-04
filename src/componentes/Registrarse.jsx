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
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload(); // Recarga la página
                    }
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
        formContent: {
            flex: '1',
            fontSize: '15px',
            padding: '30px',
            height: '450px',
            marginRight: '15px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FFF5B3',
            borderRadius: '10px 10px 10px 10px',
        },
        image: {
            width: '100%',
            height: '450px',
            borderRadius: '10px',
            border: '2px solid #FFF5B3'
        },
        imgContainer: {
            flex: '1',
            textAlign: 'center',
            marginRight: '20px'
        },
        divContainer: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%'
        },
        elementStyle: {
            marginTop: '-10px',
            marginBottom: '15px'
        },
        container: {
            height: '90.7vh', // Establece el alto del contenedor al 100% del alto de la ventana
            display: 'flex',
            flexDirection: 'column',
        },
    }

    return (
        <div className="container" style={styles.container}>
            <div style={styles.titleHeader}>
                <h3>Registrarse</h3>
            </div>
            <div style={styles.divContainer}>
                <div style={styles.formContent}>
                    <form onSubmit={store}>
                        <div style={styles.elementStyle}>
                            <label htmlFor="name" className="form-label">Nombre</label>
                            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div style={styles.elementStyle}>
                            <label htmlFor="last_name" className="form-label">Apellido</label>
                            <input type="text" className="form-control" id="last_name" value={last_name} onChange={(e) => setLast_name(e.target.value)} required />
                        </div>
                        <div style={styles.elementStyle}>
                            <label htmlFor="email" className="form-label">Correo</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div style={styles.elementStyle}>
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div style={styles.elementStyle}>
                            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                            <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary form-control">Crear</button>
                    </form>
                </div>

                <div style={styles.imgContainer}>
                    <img src="https://wallpapercave.com/wp/wp2036900.jpg" alt="imagen" style={styles.image} />
                </div>
            </div>
            
        </div>
    );
};

export default Registrarse;
