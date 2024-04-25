import React, {createContext, useState, useContext, useEffect} from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)

    const login = (newToken) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null)
    }

    const decodeToken = (token) => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token)
                const tokenData = {
                    auth_user_id: decodedToken.user_id,
                    auth_role_id: decodedToken.role_id,
                    auth_user_name: decodedToken.user_name,
                    auth_token_iat: decodedToken.iat,
                    auth_token_exp: decodedToken.exp,
                }
                return tokenData
            } catch (err) {
                
            }
        } else {
            return null;
        }
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const decodedToken = decodeToken(storedToken);
            if (decodedToken && decodedToken.auth_token_exp > Date.now() / 1000) {
                setToken(storedToken);
            } else {
                localStorage.removeItem('token');
                setToken(null);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token, login, logout, decodeToken}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}