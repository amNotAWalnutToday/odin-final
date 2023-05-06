import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, UserContext } from '../../RouteSwitch';

type Props = {
    toggleShowCreateSub: () => void,
}

export default function CreateCommunityForm({toggleShowCreateSub}: Props) {
    const navigate = useNavigate();
    const [communityName, setCommunityName] = useState<string>('');
    const { user } = useContext(UserContext);
    
    const createCommunity = async () => {
        try {
            const newCommunity = {
                name: communityName,
                summary: 'Update This Summary Later On The Sub Page Sidebar',
                icon: '',
                categories: [],
                rules: [],
                timestamp: Timestamp.now(),
                creator: user?.name,
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
                    onChange={(e) => setCommunityName(e.target.value)}
                />
                <div>
                    <p className="text-trivial" >
                        {21 - communityName.length} characters remaining.
                    </p>
                    <p className="text-trivial" style={{color: 'red'}} >
                        {communityName.length < 2 && 'Name is required.'}
                    </p>
                </div>
                <hr />
                <button 
                    className="btn orange-bg" 
                    onClick={createCommunity}
                >
                    Create Community
                </button>
            </div>
        </>
    )
}
