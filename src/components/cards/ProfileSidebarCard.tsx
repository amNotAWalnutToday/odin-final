import { useParams, useNavigate } from "react-router-dom";
import SubDropdown from "../other/SubDropdown";

type Props = {
    pageType: string,
}

export default function ProfileSidebarCard({pageType}: Props) {
    const { username } = useParams();
    const navigate = useNavigate();
    
    return(
        <div className="card border" >
            <div className="header card" >

            </div>
            <div className="card body">
                <div style={{alignSelf: 'center'}} >
                    <h2>
                        {username}
                    </h2>
                    <p className="text-trivial" >u/{username}</p>
                </div>
                <button 
                    className="btn" 
                    onClick={() => navigate('/submit')}
                >
                    New Post
                </button>
                <SubDropdown 
                    pageType={pageType}
                />
            </div>
        </div>
    )
}
