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

    return (
        <div className='container'>
            <h3>Perfil</h3>
            <div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ flex: '1', marginRight: '10px' }}>
                        <img
                            src="https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_960_720.png"
                            alt="Imagen"
                            style={{ width: '90%', height: '460px', marginTop: '5px', marginLeft: '10px' }}
                        />
                    </div>
                {
                    token && !isEditMode ? (
                        <div style={{ flex: '1', marginLeft: '10px', marginTop: '50px' }}>
                                <label> Nombre </label>
                                    <input type="text" disabled value={user.name} className='form-control' />
                                <br />
                                <label> Apellido </label>
                                    <input type="text" disabled value={user.last_name} className='form-control' />
                                <br />
                                <label> Email </label>
                                    <input type="text" disabled value={user.email} className='form-control' />
                                <br />
                                <a href='#' onClick={toggleEditMode} className='btn btn-primary form-control'>Editar</a>
                        </div>

                    ) : (
                        <div style={{ flex: '1', marginLeft: '10px' }}>
                            <form style={{ width: '100%' }} onSubmit={updateUserHandle}>
                                <label> Nombre </label>
                                    <input type="text" placeholder={user.name} onChange={(e) => setName(e.target.value)} className='form-control' />
                                <br />
                                <label> Apellido </label>
                                    <input type="text" placeholder={user.last_name} onChange={(e) => setLastName(e.target.value)} className='form-control' />
                                <br />
                                <label> Email </label>
                                    <input type="text" placeholder={user.email} onChange={(e) => setEmail(e.target.value)} className='form-control' />
                                <br />
                                <label> Contraseña </label>
                                    <input type="password" className='form-control' onChange={(e) => setPassword(e.target.value)} />
                                <br />
                                <label> Confirmar contraseña </label>
                                    <input type="password" className='form-control' onChange={(e) => setPasswordConfirmation(e.target.value)} />
                                <br />
                                <div style={{ display: 'flex', width: '100%' }}>
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