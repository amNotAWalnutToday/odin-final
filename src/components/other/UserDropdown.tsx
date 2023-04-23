import { signOut } from "firebase/auth"
import { auth } from "../../RouteSwitch"

export default function UserDropdown() {
    const signOutUser = async () => {
        try {
            await signOut(auth);
            console.log('sign out successful');
        } catch(err) {
            console.error('not signed in');
        }
    }
    
    return(
        <div>
            <li onClick={signOutUser} >Log Out</li>
        </div>
    )
}
