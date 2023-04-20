import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';

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