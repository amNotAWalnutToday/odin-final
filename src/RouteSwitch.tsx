import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import firebaseConfig from './firebase.config';
import App from './App';

const app = initializeApp(firebaseConfig);
export const db = getDatabase();

export default function RouteSwitch() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<App pageType='home' />} />
                <Route path='/sub' element={<App pageType='sub' />} />
            </Routes>
        </Router>
    )
}