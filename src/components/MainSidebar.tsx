import { Link } from 'react-router-dom';

export default function MainSidebar() {
    return (
        <aside className="sidebar main">
            <nav>
                <p>FEEDS</p>
                <button>Popular</button>
                <p>TOPICS</p>
                <ul>
                    <li>
                        <Link to='/t/programming'>Programming</Link>
                    </li>
                    <li>
                        <Link to='/t/gaming'>Gaming</Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
} 
