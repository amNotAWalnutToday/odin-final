import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, query, where, collection, getDocs } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import firebaseConfig from './firebase.config';
import App from './App';
import UserSchema from './schemas/user';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);

interface UserContextInterface {
    user: UserSchema | undefined,
    setUser: React.Dispatch<React.SetStateAction<UserSchema | undefined>>
}

export const UserContext = createContext({} as UserContextInterface);

export default function RouteSwitch() {
    const [user, setUser] = useState<UserSchema>();
    const [relogAttempts, setRelogAttempts] = useState(0);

    const appProps = {
        user,
        setUser,
    }

    const relog = async (uid: string | null) => {
        try {
            const userQuery = query(
                collection(db, "users"),
                where("uid", "==", uid) 
            );
            const snapshot = await getDocs(userQuery);
            let authedUser;
            snapshot.forEach((userData) => {
                authedUser = userData.data();
            });
            setUser(authedUser);
        } catch(err) {
            console.error("Trying Again...");
        }
    }

    useEffect(() => {
        setTimeout(async() => {
            try {
                if(auth.currentUser) await relog(auth.currentUser.uid);
                else throw Error;
            } catch(err) {
                console.error("Not Authenticated!");
                relogAttempts < 10 && setRelogAttempts((attempts) => attempts + 1);
            }
        }, 1000);
    }, [relogAttempts]);

    return (
        <Router basename='/odin-final-clone'> 
            <UserContext.Provider value={{user, setUser}}>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <App
                                pageType='home'
                                {...appProps}
                            />
                        }
                    />
                    <Route
                        path='/submit'
                        element={
                            <App
                                pageType='submit'
                                {...appProps}
                            />
                        }
                    />
                    <Route
                        path='/r/:sub'
                        element={
                            <App
                                pageType='sub'
                                {...appProps}
                            />
                        }
                    />
                    <Route
                        path='/r/:sub/submit'
                        element={
                            <App
                                pageType='submit'
                                {...appProps}
                            />
                        }
                    />
                    <Route
                        path='/t/:category'
                        element={
                            <App
                                pageType='list'
                                {...appProps}
                            />
                        }
                    />
                    <Route
                        path='/u/:username'
                        element={
                            <App
                                pageType='user'
                                {...appProps}
                            />
                        }
                    />
                    <Route
                        path='/r/:sub/:post/comments'
                        element={
                            <App
                                pageType='post'
                                {...appProps}
                            />
                        }
                    />
                </Routes>
            </UserContext.Provider>
        </Router>
    )
}
