import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom';
import { auth } from "../../RouteSwitch"
import UserSchema from "../../schemas/user"

type Props = {
    user: UserSchema | undefined,
    setUser: React.Dispatch<React.SetStateAction<UserSchema | undefined>>,
    isDarkMode: boolean,
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function UserDropdown({user, setUser, isDarkMode, setIsDarkMode}: Props) {    
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

    const switchColorScheme = () => {
        const colorScheme = localStorage.getItem("darkmode");
        if(!colorScheme) {
            localStorage.setItem("darkmode", "true");
            setIsDarkMode(() => true);
        } else {
            localStorage.removeItem("darkmode");
            setIsDarkMode(() => false);
        }
    }
    
    return user ? (
        <div className="border dropdown-box nav" >
            <ul>
                <li onClick={() => navigate(`/u/${user.name}`)} >{user.name}</li>
                <li onClick={() => switchColorScheme()} 
                    className="line-flex"
                    style={{display: 'flex' }}
                >
                    Dark Mode
                    <span className={`toggle-btn-${isDarkMode ? 'on' : 'off'}`} ></span>
                </li>
                <li onClick={signOutUser} >Log Out</li>
            </ul>
        </div>
    ) : (
        <div></div>
    )
}
