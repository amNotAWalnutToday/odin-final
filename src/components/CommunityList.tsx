import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../RouteSwitch';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

type SubSchema = {
    summary: string,
    name: string,
    icon: string,
    categories: string[],
}

export default function CommunityList() {
    const { category } = useParams();
    const [subs, setSubs] = useState<SubSchema[]>([]);

    useEffect(() => {
        getCommunities();
        /*eslint-disable-next-line*/
    }, [category]);

    const getCommunities = async () => {
        const communityQuery = query(
            collection(db, "subs"), 
            where("categories", 'array-contains', category)
        )
        const snapshot = await getDocs(communityQuery);
        const subList: any = []
        snapshot.forEach((sub) => {
            subList.push(sub.data());
        });
        setSubs(subList);
    }

    const mapCommunities = () => {
        return subs.map((sub, ind) => {
            return (
                <li className='sub-link' key={ind}>
                    <span className='default-icon' />{' '}
                    <span style={{alignSelf: 'center'}}>
                        r/{sub.name.replace(' ', '')}
                        <span className='summary' >
                            0 members
                        </span>
                        <span className='summary' >
                            {sub.summary}
                        </span>
                        <Link to='/'>
                            Visit
                        </Link>
                    </span>
                </li>
            )
        })
    }
    
    return(
        <div className="post border" >
            <ul className="post-main vpad" >
                {mapCommunities()}
            </ul>
        </div>
    )
}
