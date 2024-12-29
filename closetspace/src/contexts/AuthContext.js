import React, { useContext, useState, useEffect } from "react";
import { auth } from "../config/firestore";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    async function signup(email, password) {
        // return createUserWithEmailAndPassword(auth, email, password);
        return createUserWithEmailAndPassword(auth, email, password).catch((error) => {
            // Re-throw the error to be handled at the top level
            throw error;
        });
    }

    async function login(email, password) {
        // return signInWithEmailAndPassword(auth, email, password);
        return signInWithEmailAndPassword(auth, email, password).catch((error) => {
            // Re-throw the error to be handled at the top level
            throw error;
        });
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
