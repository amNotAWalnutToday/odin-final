import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import { useState } from 'react';

type Props = {
    toggleLoginForm: any,
}

export default function Header({toggleLoginForm}: Props) {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <header className="header main" >
            <div className='line-flex' >
                <span className='logo'/>
                <h1 style={{fontSize: '24px'}} ><Link to='/'>replicatedit</Link></h1>
            </div>
            <input 
                type="search" 
                placeholder='Search replicatedit'
            />
            <div className='line-flex' >
                <button className='btn' onClick={toggleLoginForm} >Log in</button>
                <button className='dropdown-btn border' onClick={toggleDropdown}>
                    <img className='btn-img' src="person.svg" alt="" />
                </button>
                {dropdownOpen && <UserDropdown />}
            </div>
        </header>
    )
}