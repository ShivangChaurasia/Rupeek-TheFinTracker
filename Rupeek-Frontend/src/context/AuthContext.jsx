import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import { doc, onSnapshot, deleteDoc } from "firebase/firestore";
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

    async function loginWithGoogle() {
        try {
            return await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Google Login Error:', error);
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
                console.log('Popup blocked, falling back to redirect...');
                return await signInWithRedirect(auth, googleProvider);
            }
            throw error;
        }
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        let profileUnsubscribe;

        const checkRedirect = async () => {
            try {
                await getRedirectResult(auth);
            } catch (error) {
                console.error("Redirect sign-in error:", error);
            }
        };
        checkRedirect();

        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);

            if (user) {
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

    async function deleteUserAccount(password) {
        if (!currentUser) return;

        try {
            if (currentUser.providerData.some(p => p.providerId === 'google.com')) {
                try {
                    await signInWithPopup(auth, googleProvider);
                } catch (popupError) {
                    if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/cancelled-popup-request') {
                        await signInWithRedirect(auth, googleProvider);
                        return;
                    }
                    throw popupError;
                }
            } else if (password) {
                await reauthenticate(password);
            } else {
                throw new Error("Password required for deletion");
            }

            const userDocRef = doc(db, 'users', currentUser.uid);
            await deleteDoc(userDocRef);

            await currentUser.delete();
        } catch (error) {
            console.error("Error deleting account:", error);
            throw error;
        }
    }

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateUserPassword,
        reauthenticate,
        deleteUserAccount
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}