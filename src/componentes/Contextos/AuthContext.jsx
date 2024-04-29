import React, { createContext, useState, useContext, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

const LoadingScreen = () => {
    return (
        <div style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        }}>
            <div style={{ color: 'white', fontSize: '24px' }}>Cargando...</div>
        </div>
    );
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const decodeToken = (token) => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const tokenData = {
                    auth_user_id: decodedToken.user_id,
                    auth_role_id: decodedToken.role_id,
                    auth_user_name: decodedToken.user_name,
                    auth_token_iat: decodedToken.iat,
                    auth_token_exp: decodedToken.exp,
                };
                return tokenData;
            } catch (err) {
                console.error('Error decoding token:', err);
                return null;
            }
        } else {
            return null;
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const decodedToken = decodeToken(storedToken);
            if (decodedToken && decodedToken.auth_token_exp > Date.now() / 1000) {
                setToken(storedToken);
            } else {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider value={{ token, login, logout, decodeToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
