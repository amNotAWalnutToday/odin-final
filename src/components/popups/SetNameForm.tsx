import {
    query,
    doc,
    getDocs,
    updateDoc,
    collection,
    where,
} from 'firebase/firestore';
import { useRef } from 'react';
import { db } from '../../RouteSwitch';
import UserSchema from '../../schemas/user';

type Props = {
    user: UserSchema | undefined,
    toggleShowSetName: () => void,
}

export default function SetNameForm({user, toggleShowSetName}: Props) {
    const username = useRef<HTMLInputElement>(null);

    const updateName = async () => {
        try {
            if(!user || !username.current) throw console.error('no user!');
            if(!username.current.value) return;
            const userQuery = query(
                collection(db, 'users'),
                where("email", '==', user.email)
            );
            const snapshot = await getDocs(userQuery);
            let uid: any;
            snapshot.forEach(async (user) => {
                uid = user.id;
            }) 
            await updateDoc(doc(db, 'users', uid), {name: username.current.value});
            toggleShowSetName();
            console.log('username is now ' + username.current.value);
        } catch(e) {
            console.error(e);
        }
    }

    return(
        <>
            <div className="underlay" />
            <div className="card body popup rounded-border">
                <button className="close-btn" onClick={toggleShowSetName} >X</button>
                <h1>Set Username</h1>
                <p>Welcome to Replicatedit, to get started you should set a username.</p>
                <p>Whenever you create a post this is the name other users will see.</p>
                <hr />
                <input 
                    ref={username}
                    type="text" 
                    placeholder="Username"
                />
                <button
                    className="btn orange-bg"
                    onClick={updateName}
                >
                    Set Name
                </button>
            </div>
        </>
    )
}