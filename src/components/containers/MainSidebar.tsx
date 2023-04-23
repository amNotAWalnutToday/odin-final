import { Link } from 'react-router-dom';

export default function MainSidebar() {
    return (
        <aside className="sidebar main">
            <nav>
                <p className='text-trivial' >FEEDS</p>
                <Link to='/'>Popular</Link>
                <p className='text-trivial' >TOPICS</p>
                <div>
                    <Link to='/t/programming'>Programming</Link>
                    <Link to='/t/gaming'>Gaming</Link>
                </div>
            </nav>
        </aside>
    )
} 
