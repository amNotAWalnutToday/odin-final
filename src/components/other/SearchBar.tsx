import { query, collection, where, getDocs, limit } from 'firebase/firestore';
import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { db } from '../../RouteSwitch';
import SubSchema from '../../schemas/sub';

export default function SearchBar() {
    const navigate = useNavigate();

    const [subSearch, setSubSearch] = useState<SubSchema[]>([]);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [deferTimer, setDeferTimer] = useState<NodeJS.Timeout>();

    const searchBar = useRef<HTMLInputElement>(null);

    const resetSearch = () => {
        setSubSearch([]);
        setShowSearch(false);
    }

    const deferGet = () => {
        clearTimeout(deferTimer);
        const timer = setTimeout(() => {
            searchInputHandler();
        }, 250);
        setDeferTimer(timer);
    }

    const searchInputHandler = async () => {
        if(!searchBar.current || searchBar.current.value.length < 2) return resetSearch();
        try {
            const searchQuery = query(
                collection(db, "subs"),
                where("name", ">=", searchBar.current.value),
                limit(3),
            );
            const updatedSubSearch: any[] = [];
            const snapshot = await getDocs(searchQuery);
            snapshot.forEach((search) => {
                updatedSubSearch.push(search.data());
            })
            setSubSearch(updatedSubSearch);
            setShowSearch(true);
        } catch(err) {
            console.error(err);
            subSearch.length && setShowSearch(true);
        }
    }

    const mapSearch = () => {
        return subSearch.map((sub, ind) => {
            return(
                <li
                    key={ind}
                    className='dropdown-li line-flex'
                    onClick={() => {
                        navigate(`/r/${sub.name}`);
                        resetSearch();
                    }}
                >
                    <img className='default-icon' src={sub.icon} alt="" />
                    r/{sub.name}
                    <span className='text-trivial' >
                        {sub.members.length} members
                    </span>
                </li>
            )
        })
    }

    return(
        <div 
            className='search-container' 
            style={{padding: 0}} 
        >
            <input 
                className={`search-bar ${showSearch ? 'searching' : ''}`}
                style={{width: '100%'}}
                ref={searchBar}
                type="search" 
                placeholder='Search replicatedit'
                onChange={deferGet}
            />
            {showSearch
            &&
            <ul className='search-box heavy-border' >
                {mapSearch()}
            </ul>}
        </div>
    )
}
