import React, { createContext, useEffect, useState } from 'react';

import api from '../services/api';
import history from '../services/history';

const Context = createContext();

function AuthProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [userId, setUserId] = useState(0);
    const [user, setUser] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [updatedUsers, setUpdatedUsers] = useState(false);

    useEffect(() => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        const usuarioIdString = localStorage.getItem('userId');
        const usuarioId = JSON.parse(usuarioIdString);
        const usuarioString = localStorage.getItem('conta');
        const usuario = JSON.parse(usuarioString);
        const funcaoString = localStorage.getItem('funcao');
        const funcao = JSON.parse(funcaoString);

        if (userToken) {
            setUserId(usuarioId);
            setUser(usuario);
            setRole(funcao);
            setAuthenticated(true);
        }

        setLoading(false);
    }, []);

    const handleLogin = async ({ data }) => {
        const { conta, senha } = data;

        try {
            const response = await api.post("/usuario/login", { conta, senha });

            if (response) {
                const userToken = response.data.token;
                localStorage.setItem('token', JSON.stringify(userToken));
                setAuthenticated(true);
                setUserId(response.data.id);
                localStorage.setItem('userId', JSON.stringify(response.data.id));
                setUser(response.data.conta);
                localStorage.setItem('conta', JSON.stringify(response.data.conta));
                setRole(response.data.funcao);
                localStorage.setItem('funcao', JSON.stringify(response.data.funcao));
                setLoading(false);
                setError(false);
                history.push("/");
            }
        } catch (error) {
            setError(true);
        }
    }

    if (loading) {
        return <h2>Loading...</h2>
    }

    return (
        <Context.Provider value={{ authenticated, setAuthenticated, userId, setUserId, user, setUser, role, setRole, loading, setLoading, handleLogin, setError, error, updatedUsers, setUpdatedUsers }}>
            { children}
        </Context.Provider>
    );
}

export { Context, AuthProvider };
