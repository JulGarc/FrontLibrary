import React, {createContext, useState, useContext} from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)

    const login = (newToken) => {
        setToken(newToken)
    }

    const logout = () => {
        setToken(null)
    }

    const decodeToken = (token) => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token)
                const tokenData = {
                    auth_user_id: decodedToken.user_id,
                    auth_role_id: decodedToken.role_id,
                    auth_token_iat: decodedToken.iat,
                    auth_token_exp: decodedToken.exp
                }
                return tokenData
            } catch (err) {
                
            }
        } else {
            return null;
        }
    }

    return (
        <AuthContext.Provider value={{ token, login, logout, decodeToken}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}