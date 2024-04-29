import React, {useState, useEffect} from 'react'
import { useAuth } from './Contextos/AuthContext'
import { API_URL } from '../config/config';
import Swal from 'sweetalert2'

const Perfil = () => {
    const  { token } = useAuth();
    const {decodeToken} = useAuth()
    const tokenData = decodeToken(token)
    const [user, setUser] = useState([])
    const [name, setName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [passwordConfirmation, setPasswordConfirmation] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const URI = `${API_URL}/users/details/${tokenData.auth_user_id}`
    let responseData;
    let responseStatus;

    const getUserData = async () => {
        try {

            const query = await fetch(`${URI}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })

            responseData = await query.json()
            responseStatus = query.status
            

            if (responseStatus != 200) {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: responseData.error
                })
            } else {
                setUser(responseData.data)
                console.log("data: ", responseData)
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    const updateUser = async () => {
        try {
            const request = {
                name: name,
                last_name: lastName,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation
            }
            const URI_UPDATE = `${API_URL}/users/update/${tokenData.auth_user_id}`
            const query = await fetch(`${URI_UPDATE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(request)
            })

            responseData = await query.json()
            responseStatus = query.status
            

            if (responseStatus != 200) {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: responseData.error
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'ÉXITO',
                    text: "Datos actualizados correctamente"
                })
                setUser(responseData.data)
                getUserData()
                setIsEditMode(false)
                console.log("data: ", responseData)
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message
            })
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode)
    }    

    const updateUserHandle = (event) => {

        //1: No existe una confirmacion de contra
        event.preventDefault();
        if (password && !passwordConfirmation) {
            return Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: "Porfavor confirma la contraseña"
            })

        }

        //2, existem ambas, pero no coinciden
        if ((password && passwordConfirmation) && (password != passwordConfirmation) ) {
            return Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: "Los campos contraseña y confirmar contraseña no coinciden"
            })
        } 
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres actualizar tus datos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                updateUser()
            }
        });
    }

    const styles = {
        editFormContent: {
            flex: '1',
            marginLeft: '10px',
            marginTop: '20px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FFF5B3',
            borderRadius: '5px 5px 5px 5px',
            padding: '25px',
            height: '440px'
        },
        formContent: {
            flex: '1',
            marginLeft: '10px',
            marginTop: '20px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FFF5B3',
            borderRadius: '5px 5px 5px 5px',
            padding: '25px',
        },
        titleHeader: {
            marginTop: '15px',
            textAlign: 'center',
            padding: '5px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FFF5B3',
            borderRadius: '50px 5px 50px 5px',
        },
        inputFormContent: {
            marginBottom: '10px'
        }
    }

    return (
        <div className='container'>
            <div style={styles.titleHeader}>
                <h3>Mi Perfil</h3>
            </div>
            <div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ flex: '1', marginRight: '10px' }}>
                        <img
                            src="https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png"
                            alt="Imagen"
                            style={{ width: '100%', height: '400px', marginTop: '10px', marginLeft: '10px' }}
                        />
                    </div>
                {
                    token && !isEditMode ? (
                        <div style={styles.formContent}>
                                <div style={{ marginBottom: '15px', marginTop: '20px' }}>
                                    <label> Nombre </label>
                                    <input style={styles.inputFormContent} type="text" disabled value={user.name} className='form-control' />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label> Apellido </label>
                                    <input style={styles.inputFormContent} type="text" disabled value={user.last_name} className='form-control' />
                                </div>

                                <div style={{ marginBottom: '60px' }}>
                                    <label> Email </label>
                                    <input style={styles.inputFormContent} type="text" disabled value={user.email} className='form-control' />
                                </div>

                                <a href='#' onClick={toggleEditMode} className='btn btn-primary form-control'>Editar</a>

                        </div>

                    ) : (
                        <div style={styles.editFormContent}>
                            <form style={{ width: '100%' }} onSubmit={updateUserHandle}>
                                <div style={{ marginBottom: '10px', marginTop: '-10px' }}>
                                    <label> Nombre </label>
                                    <input type="text" placeholder={user.name} onChange={(e) => setName(e.target.value)} className='form-control' />
                                </div>
                                
                                <div style={{ marginBottom: '10px' }}>
                                    <label> Apellido </label>
                                    <input type="text" placeholder={user.last_name} onChange={(e) => setLastName(e.target.value)} className='form-control' />
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <label> Email </label>
                                    <input type="text" placeholder={user.email} onChange={(e) => setEmail(e.target.value)} className='form-control' />
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <label> Contraseña </label>
                                    <input type="password" className='form-control' onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <label> Confirmar contraseña </label>
                                    <input type="password" className='form-control' onChange={(e) => setPasswordConfirmation(e.target.value)} />
                                </div>

                                <div style={{ display: 'flex', width: '100%', marginTop: '15px' }}>
                                    <button type="submit" className='btn btn-primary form-control' style={{ flex: '1', marginRight: '5px' }}>Actualizar</button>
                                    <a href='#' onClick={toggleEditMode} className='btn btn-danger form-control' style={{ flex: '1', marginLeft: '5px' }}>Cancelar</a>
                                </div>
                            </form>
                        </div>
                    )
                }
                </div>
            </div>
        </div>
    )
}

export default Perfil