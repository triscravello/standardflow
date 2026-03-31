// /context/authContext.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/models/Users";

interface AuthContextType {
    user: typeof User | null;
    setUser: (user: typeof User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<typeof User | null>(null);

    useEffect(() => {
        // Fetch the current user from the server when the component mounts
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                })
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}