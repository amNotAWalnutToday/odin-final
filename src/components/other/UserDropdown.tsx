import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom';
import { auth } from "../../RouteSwitch"
import UserSchema from "../../schemas/user"

type Props = {
    user: UserSchema | undefined,
    setUser: React.Dispatch<React.SetStateAction<UserSchema | undefined>>,
}

export default function UserDropdown({user, setUser}: Props) {    
    const navigate = useNavigate();
    
    const signOutUser = async () => {
        try {
            if(!user) throw Error;
            await signOut(auth);
            setUser(undefined);
            console.log('sign out successful');
        } catch(err) {
            console.error('not signed in');
        }
    }
    
    return user ? (
        <div className="border dropdown-box nav" >
            <ul>
                <li onClick={() => navigate(`/u/${user.name}`)} >{user.name}</li>
                <li onClick={signOutUser} >Log Out</li>
            </ul>
        </div>
    ) : (
        <div></div>
    )
}
