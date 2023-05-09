import { query, where, collection, getDocs } from 'firebase/firestore';
import { useState, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { db, UserContext } from '../../RouteSwitch';
import SubSchema from '../../schemas/sub';

type Props = {
    pageType: string,
}

export default function SubDropdown({pageType}: Props) {
    const navigate = useNavigate();
    const { sub } = useParams();

    const [availableSubs, setAvailableSubs] = useState<SubSchema[]>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);
    const toggleIsOpen = async () => { 
        if(!hasLoaded) await getCommunities();
        setIsOpen(!isOpen);
    } 

    const { user } = useContext(UserContext);

    const getCommunities = async () => {
        if(!user) return;
        const communityQuery = query(
            collection(db, "subs"), 
            where("members", 'array-contains', user?.email)
        )
        const snapshot = await getDocs(communityQuery);
        const subList: any = []
        snapshot.forEach((sub) => {
            subList.push(sub.data());
        });
        setAvailableSubs(subList);
        setHasLoaded(true);
    }

    const mapSubs = () => {
        return availableSubs?.map((sub, ind) => {
            return(
                <li 
                    key={ind}
                    className='text-trivial dropdown-li'
                    onClick={() => {
                        const navUrlSuffix = pageType === 'submit' ? '/submit' : ''
                        navigate(`/r/${sub.name}` + navUrlSuffix)}
                    } 
                >
                    r/{sub.name}
                </li>
            )
        });
    }

    return(
        <div 
            style={pageType === 'post' ? {display: 'none'} : {}}
            className={`flex-col border ${pageType === 'submit' && 'dropdown'}`} 
            onMouseLeave={() => setIsOpen(false)}
        >
            <h4 className='dropdown-li' onClick={toggleIsOpen}>
                {sub && 'r/'}{sub ?? 'Your Communities'}
            </h4>
            {isOpen
            &&
            <ul className='heavy-border dropdown-bar' >
                {mapSubs()}
            </ul>
            }
        </div>
    )
}
