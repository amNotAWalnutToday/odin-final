import { 
    sendSignInLinkToEmail, 
    isSignInWithEmailLink, 
    signInWithEmailLink,
} from 'firebase/auth';
import { 
    query, 
    getDocs,
    addDoc,
    collection, 
    where, 
    Timestamp 
} from 'firebase/firestore';
import { useRef } from 'react';
import { db, auth } from '../../RouteSwitch';
import UserSchema from '../../schemas/user';

const actionCodeSettings = {
    url: 'http://localhost:3000/',
    handleCodeInApp: true,
};

type Props = {
    toggleLoginForm: () => void,
    canLogin: boolean,
    setUser: React.Dispatch<React.SetStateAction<UserSchema | undefined>>,
}

export default function LoginForm({toggleLoginForm, canLogin, setUser}: Props) {
    const email = useRef<HTMLInputElement>(null);

    const authStepOne = async () => {
        try {
            if(!email.current) return;
            await sendSignInLinkToEmail(auth, email.current.value, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email.current.value);
            console.log('email sent');
        } catch(e) {
            console.error(e);
            console.error('email failed to send');
        }
    }

    const signIn = async () => {
        try {
            if(isSignInWithEmailLink(auth, window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn');
                if(!email) return;
                const authedUser = await signInWithEmailLink(auth, email, window.location.href);
                let currentUser: UserSchema | undefined;
                const userQuery = query(
                    collection(db, 'users'),
                    where("email", "==", email)
                );
                const snapshot = await getDocs(userQuery);
                snapshot.forEach((user) => {
                    const userTypes = user.data();
                    currentUser = {
                        uid: userTypes.uid,
                        email: userTypes.email,
                        name: userTypes.name,
                        timestamp: userTypes.timestamp
                    }
                });
                if(!currentUser) {
                    currentUser = {
                        uid: authedUser.providerId,
                        email,
                        name: 'Anon',
                        timestamp: Timestamp.now(),
                    }
                    const userRef = await addDoc(collection(db, 'users'), currentUser);
                    console.log('new user created', userRef.id);
                }
                window.localStorage.removeItem('emailForSignIn');
                console.log('signed in');
                setUser(currentUser);
            }
        } catch(e) {
            console.error('could not sign in');
        }
    }

    return(
        <>
            <div className="underlay"/>
            <div className="card body popup rounded-border">
                <button className='close-btn' onClick={toggleLoginForm}>X</button>
                <h1>Log In</h1>
                <p>By continuing, you are setting up a Replicatedit account and agree to our User Agreement and Privacy Policy.</p>
                <hr />
                {canLogin 
                    ? 
                    <p>Email Confirmed! Continue with Login</p> 
                    :
                    <input 
                        ref={email}
                        type="text" 
                        placeholder="Email"
                    />
                }
                <button className="btn orange-bg" onClick={() => {
                    !window.localStorage.getItem('emailForSignIn') 
                        ? authStepOne()
                        : signIn();
                }}>Log In</button>
                <p>New to Replicatedit? Sign Up</p>
            </div>
        </>
    )
}
