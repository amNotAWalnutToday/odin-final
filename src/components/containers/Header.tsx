import { Link } from 'react-router-dom';
import UserDropdown from '../other/UserDropdown';
import { useState } from 'react';
import SearchBar from '../other/SearchBar';
import UserSchema from '../../schemas/user';

type Props = {
    user: UserSchema | undefined,
    setUser: React.Dispatch<React.SetStateAction<UserSchema | undefined>>,
    toggleLoginForm: () => void,
    isDarkMode: boolean,
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function Header({user, setUser, toggleLoginForm, isDarkMode, setIsDarkMode}: Props) {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <header className="header main" >
            <div className='line-flex' >
                <span className='logo'/>
                <h1 style={{fontSize: '24px'}} ><Link to='/'>replicatedit</Link></h1>
            </div>
            <SearchBar 
                
            />
            <div className='line-flex' >
                {!user 
                && 
                <button 
                    className='btn' 
                    onClick={toggleLoginForm} 
                >
                    Log in
                </button>}
                {user 
                && 
                <button className='dropdown-btn border' onClick={toggleDropdown}>
                    <img className='btn-img' src="person.svg" alt="" />           
                </button>}
                {dropdownOpen 
                && 
                <UserDropdown 
                    user={user}
                    setUser={setUser} 
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                />}
            </div>
        </header>
    )
}