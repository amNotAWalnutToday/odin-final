import { 
    Timestamp, 
    addDoc, 
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, UserContext } from '../../RouteSwitch';

type Props = {
    toggleShowCreateSub: () => void,
}

export default function CreateCommunityForm({toggleShowCreateSub}: Props) {
    const navigate = useNavigate();
    const [communityName, setCommunityName] = useState<string>('');
    const [isNameTaken, setIsNameTaken] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([])
    const { user } = useContext(UserContext);

    useEffect(() => {
        if(!isNameTaken) return;
        createCommunity();
        /*eslint-disable-next-line*/
    }, [isNameTaken]);

    const checkIfNameTaken = async (name: string) => {
        try {
            if(!user) throw console.error('no user');
            if(name.length < 3) throw Error;
            const subQuery = query(
                collection(db, "subs"),
                where("name", "==", name)
            );
            const snapshot = await getDocs(subQuery);
            let isTaken = false;
            snapshot.forEach(user => {
                if(user.data()) isTaken = true;
            });
            !isTaken 
                ? setIsNameTaken((b) => !b)
                : setErrors(['Name is taken.']);
        } catch(err) {
            console.error(err);
        }
    }
    
    const createCommunity = async () => {
        try {
            if(!user || !communityName) return;
            const newCommunity = {
                name: communityName,
                summary: 'Update This Summary Later On The Sub Page Sidebar',
                icon: '',
                custom: {
                    bannerColor: '#1199ff',
                    cardHeaderColor: '#0079d3',
                    pageBackground: ''
                },
                categories: [],
                rules: [],
                timestamp: Timestamp.now(),
                members: [user?.uid],
                creator: user?.uid,
            }
            await addDoc(collection(db, 'subs'), newCommunity);
            toggleShowCreateSub();
            navigate(`/r/${communityName}`);
        } catch(err) {
            console.error('something went wrong...');
        }
    }

    return(
        <>
            <div className="underlay" />
            <div className="card body popup rounded-border">
                <button className="close-btn" onClick={toggleShowCreateSub}>X</button>
                <h1>Create Community</h1>
                <hr />
                <div>
                    <label htmlFor="sub-name">
                        <strong>Name</strong>
                    </label>
                    <p className="text-trivial">
                        cannot be changed later!
                    </p>
                </div>
                <input 
                    id="sub-name"
                    className="border"
                    type="text" 
                    placeholder="Community Name..."
                    maxLength={21}
                    onChange={(e) => {
                            setCommunityName(e.target.value.trim());
                            setErrors(() => ['']);
                        }
                    }
                />
                <div>
                    <p className="text-trivial" >
                        {21 - communityName.length} characters remaining.
                    </p>
                    <p className="text-trivial" style={{color: 'red'}} >
                        {communityName.length < 3 && 'Name is required.'}
                    </p>
                    <p className='text-trivial' style={{color: 'red'}} >
                        {errors[0] ?? ''}
                    </p>
                </div>
                <hr />
                <button 
                    className="btn orange-bg" 
                    onClick={() => checkIfNameTaken(communityName ?? '')}
                >
                    Create Community
                </button>
            </div>
        </>
    )
}
