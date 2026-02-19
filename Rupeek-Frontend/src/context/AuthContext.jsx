import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function loginWithGoogle() {
        return signInWithPopup(auth, googleProvider);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        let profileUnsubscribe;

        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);

            if (user) {
                // Subscribe to user profile
                profileUnsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
                    if (doc.exists()) {
                        setUserProfile(doc.data());
                    } else {
                        setUserProfile(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user profile:", error);
                    setLoading(false);
                });
            } else {
                setUserProfile(null);
                setLoading(false);
            }
        });

        return () => {
            authUnsubscribe();
            if (profileUnsubscribe) profileUnsubscribe();
        };
    }, []);

    function updateUserPassword(password) {
        return updatePassword(currentUser, password);
    }

    function reauthenticate(password) {
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        return reauthenticateWithCredential(currentUser, credential);
    }

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateUserPassword,
        reauthenticate
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}