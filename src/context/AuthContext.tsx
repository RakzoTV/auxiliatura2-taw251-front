import { createContext, useContext, useState, type ReactNode } from "react";
import type { Usuario } from "../types";

interface AuthContextValue {
    token: string | null;
    usuario: Usuario | null;
    isAuthenticated: boolean;
    login: (token: string, usuario: Usuario) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    function login(token: string, usuario: Usuario) {
        localStorage.setItem("token", token);
        setToken(token);
        setUsuario(usuario);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUsuario(null);
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                usuario,
                isAuthenticated: !!token,
                login,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
}

