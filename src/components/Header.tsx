import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="header main" >
            <h1><Link to='/'>Replicatedit</Link></h1>
            <input type="search" />
            <button>Login</button>
            <button>ø</button>
        </header>
    )
}