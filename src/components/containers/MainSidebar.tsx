import { Link, useParams } from 'react-router-dom';
import categories from '../../data/categories.json';

export default function MainSidebar() {
    const { category } = useParams();

    const mapCategories = () => {
        return categories.map((categoryItem, ind) => {
            return(
                <Link  
                    key={ind}
                    to={categoryItem.url}
                    className={`${category === categoryItem.group.toLowerCase() 
                        && 'pseudo-select'}`
                    }
                >
                    {categoryItem.group}
                </Link>
            )
        });
    }

    return (
        <aside className="sidebar main">
            <nav>
                <p className='text-trivial' >FEEDS</p>
                <Link to='/'>Popular</Link>
                <p className='text-trivial' >TOPICS</p>
                <div>
                    {mapCategories()}
                </div>
            </nav>
        </aside>
    )
} 
