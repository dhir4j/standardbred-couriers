
"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    isEmployee: boolean;
}

interface SessionContextType {
    session: User | null;
    setSession: (user: User | null) => void;
    clearSession: () => void;
    isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [session, setSessionState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedSession = localStorage.getItem('userSession');
            if (storedSession) {
                setSessionState(JSON.parse(storedSession));
            }
        } catch (error) {
            console.error("Failed to parse session from localStorage", error);
            localStorage.removeItem('userSession');
        }
        setIsLoading(false);
    }, []);

    const setSession = useCallback((user: User | null) => {
        setSessionState(user);
        if (user) {
            localStorage.setItem('userSession', JSON.stringify(user));
        } else {
            localStorage.removeItem('userSession');
        }
    }, []);

    const clearSession = useCallback(() => {
        setSessionState(null);
        localStorage.removeItem('userSession');
    }, []);

    return (
        <SessionContext.Provider value={{ session, setSession, clearSession, isLoading }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
