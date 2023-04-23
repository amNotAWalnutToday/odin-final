import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from './firebase.config';
import App from './App';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default function RouteSwitch() {
    return (
        <Router>
            <Routes>
                <Route 
                    path='/' 
                    element={
                        <App pageType='home' />
                    } 
                />
                <Route 
                    path='/r/:sub' 
                    element={
                        <App pageType='sub' />
                    } 
                />
                <Route 
                    path='/t/:category' 
                    element={
                        <App pageType='list' />
                    }
                />
            </Routes>
        </Router>
    )
}
