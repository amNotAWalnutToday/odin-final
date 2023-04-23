import { 
    sendSignInLinkToEmail, 
    isSignInWithEmailLink, 
    signInWithEmailLink,
    signOut 
} from 'firebase/auth';
import { useRef } from 'react';
import { auth } from '../RouteSwitch';

const actionCodeSettings = {
    url: 'http://localhost:3000/',
    handleCodeInApp: true,
};

export default function LoginForm() {
    const email = useRef<HTMLInputElement>(null);

    const authStepOne = async () => {
        try {
            if(!email.current) return;
            await sendSignInLinkToEmail(auth, email.current.value, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email.current.value);
            console.log('email sent');
        } catch(e) {
            console.error('email failed to send');
        }
    }

    const signIn = async () => {
        try {
            if(isSignInWithEmailLink(auth, window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn');
                if(!email) return;
                await signInWithEmailLink(auth, email, window.location.href);
                window.localStorage.removeItem('emailForSignIn');
                console.log('signed in');
            }
        } catch(e) {
            console.error('could not sign in');
        }
    }

    return(
        <>
            <div className="underlay"/>
            <div className="card body popup border">
                <h1>Log In</h1>
                <p>By continuing, you are setting up a Reddit account and agree to our User Agreement and Privacy Policy.</p>
                <hr />
                <input 
                    ref={email}
                    type="text" 
                    placeholder="Email"
                />
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
