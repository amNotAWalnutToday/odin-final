import { useNavigate } from "react-router-dom"

export default function CreatePostBar() {
    const navigate = useNavigate();

    return(
        <div className="bar border" >
            <span className="default-icon" />
            <input 
                onClick={() => navigate('./submit')}
                onChange={() => navigate('./submit')}
                className="border" 
                type="text" 
                placeholder="Create Post"
            />
        </div>
    )
}
