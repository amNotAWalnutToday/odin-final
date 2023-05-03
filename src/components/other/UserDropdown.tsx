import { signOut } from "firebase/auth"
import { auth } from "../../RouteSwitch"
import UserSchema from "../../schemas/user"

type Props = {
    user: UserSchema | undefined,
}

export default function UserDropdown({user}: Props) {    
    const signOutUser = async () => {
        try {
            await signOut(auth);
            console.log('sign out successful');
        } catch(err) {
            console.error('not signed in');
        }
    }
    
    return(
        <div className="border dropdown-box nav" >
            {user 
            && 
            <ul>
                <li>{user.name}</li>
                <li onClick={signOutUser} >Log Out</li>
            </ul>
            }
        </div>
    )
}
