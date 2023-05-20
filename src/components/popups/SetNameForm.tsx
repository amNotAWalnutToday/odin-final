import {
    query,
    doc,
    getDocs,
    updateDoc,
    collection,
    where,
} from 'firebase/firestore';
import { useEffect, useRef, useState, useContext } from 'react';
import { UserContext, db } from '../../RouteSwitch';

type Props = {
    toggleShowSetName: () => void,
}

export default function SetNameForm({toggleShowSetName}: Props) {
    const username = useRef<HTMLInputElement>(null);
    const [isNameTaken, setIsNameTaken] = useState<boolean>(false);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if(!isNameTaken) return;
        updateName();
        /*eslint-disable-next-line*/
    }, [isNameTaken]);

    const checkIfNameTaken = async (name: string) => {
        try {
            if(!user) throw console.error('no user');
            if(!name) throw Error;
            const userQuery = query(
                collection(db, "users"),
                where("name", "==", name)
            );
            const snapshot = await getDocs(userQuery);
            let isTaken = false;
            snapshot.forEach(user => {
                if(user.data()) isTaken = true;
            });
            !isTaken && setIsNameTaken((b) => !b);
        } catch(err) {
            console.error(err);
        }
    }

    const updateName = async () => {
        try {
            if(!user || !username.current) throw console.error('no user!');
            const newUserName = username.current.value;
            if(!newUserName) return;
            const userQuery = query(
                collection(db, 'users'),
                where("uid", '==', user.uid)
            );
            const snapshot = await getDocs(userQuery);
            let uid: any;
            snapshot.forEach(async (user) => {
                uid = user.id;
            });
            await updateDoc(doc(db, 'users', uid), {name: newUserName});
            toggleShowSetName();
            setUser((prev) => {
                return prev ? { ...prev, name: newUserName } : prev
            })
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
                    onClick={() => checkIfNameTaken(username?.current?.value ?? '')}
                >
                    Set Name
                </button>
            </div>
        </>
    )
}