import { useNavigate } from "react-router-dom"

type Props = {
    toggleShowCreateSub: () => void,
}

export default function HomeSidebarCard({toggleShowCreateSub}: Props) {
    const navigate = useNavigate();
    
    return(
        <div className="card border">
            <div className="header card">
            </div>
            <div className="card body">
                <h4>Home</h4>
                <p>Your personal Replicatedit frontpage. Come here to check in with your favourite communties</p>
                <hr />
                <button 
                    className="btn"
                    onClick={() => navigate('./submit')}
                >
                    Create Post
                </button>
                <button 
                    className="btn btn-input-bg"
                    onClick={toggleShowCreateSub}
                >
                    Create Community
                </button>
            </div>
        </div>
    )
}
