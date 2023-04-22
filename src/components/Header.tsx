import { Link } from 'react-router-dom';

export default function Header() {
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
                <button className='btn'>Log in</button>
                <button className='dropdown-btn border' >
                    <img className='btn-img' src="person.svg" alt="" />
                </button>
            </div>
        </header>
    )
}