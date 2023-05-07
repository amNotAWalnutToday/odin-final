import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../../RouteSwitch';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import SubSchema from '../../schemas/sub';

type Props = {
    subs: SubSchema[],
    setSubs: React.Dispatch<React.SetStateAction<SubSchema[]>>,
}

export default function CommunityList({subs, setSubs}: Props) {
    const { category } = useParams();

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
                    {!sub.icon 
                    ? <span className='default-icon' />
                    : 
                    <img 
                        className="default-icon" 
                        src={`${sub.icon}`} 
                        alt="" 
                        onError={() => <span className='default-icon' />} 
                    />
                    }
                    <span style={{alignSelf: 'center'}}>
                        {' '}r/{sub.name.replace(' ', '')}
                        <span className='summary' >
                            {sub.members.length} members
                        </span>
                        <span className='summary' >
                            {sub.summary}
                        </span>
                        <Link className='text-link' to={`/r/${sub.name}`}>
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
