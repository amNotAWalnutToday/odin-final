import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from './firebase.config';
import App from './App';
import UserSchema from './schemas/user';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default function RouteSwitch() {
    const [user, setUser] = useState<UserSchema>();

    return (
        <Router>
            <Routes>
                <Route 
                    path='/' 
                    element={
                        <App 
                            pageType='home' 
                            user={user}
                            setUser={setUser}
                        />
                    } 
                />
                <Route 
                    path='/r/:sub' 
                    element={
                        <App 
                            pageType='sub' 
                            user={user}
                            setUser={setUser}
                        />
                    } 
                />
                <Route 
                    path='/t/:category' 
                    element={
                        <App 
                            pageType='list' 
                            user={user}
                            setUser={setUser}
                        />
                    }
                />
            </Routes>
        </Router>
    )
}
