import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebase.config';
import App from './App';

const app = initializeApp(firebaseConfig);
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
                    path='/sub' 
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
