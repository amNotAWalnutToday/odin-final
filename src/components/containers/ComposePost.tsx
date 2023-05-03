import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { useState } from "react";
import { db } from "../../RouteSwitch";
import UserSchema from "../../schemas/user";

type Props = {
    user: UserSchema | undefined,
}

export default function ComposePost({user}: Props) {
    const { sub } = useParams();
    const [postDetails, setPostDetails] = useState({
        title: '',
        post: ''
    });

    const titleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDetails = {...postDetails};
        newDetails.title = e.target.value
        setPostDetails(newDetails);
    }

    const postHandler = (content: string) => {
        const newDetails = {...postDetails};
        newDetails.post = content
        setPostDetails(newDetails);
    }

    const postPost = async () => {
        try {
            /*eslint-disable-next-line*/
            if(!user) throw console.error('must be signed in');
            if(!sub) throw console.error("No sub selected to post to!");
            const newPost = {
                title: postDetails.title,
                message: postDetails.post,
                upvotes: 0,
                timestamp: Timestamp.now(),
                parent: sub,
                poster: user.name,
            }
            const postRef = await addDoc(collection(db, "posts"), newPost);
            console.log('Post sent Successful!', postRef.id);
        } catch(e) {
            console.error(e, 'Could not Post');
        }
    }

    return(
        <div>
            <div className="post-container" >
                <div style={{padding: '0'}} className="card body rounded-border">
                    <div className="compose-post-btn-grp" >
                        <button>Post</button>
                        <button disabled>Image & Video</button>
                        <button disabled>Link</button>
                        <button disabled>Poll</button>
                    </div>
                    <div className="post-main body">
                        <input
                            style={{backgroundColor: 'var(--box-bg)'}}
                            className="border"
                            type="text"
                            placeholder='Title'
                            onChange={(e) => titleHandler(e)}
                        />
                        <ReactQuill 
                            className="htmlrevert"
                            placeholder="Text(required)"
                            onChange={postHandler}
                        />
                        <button 
                            style={{alignSelf: 'flex-end'}}
                            className="btn flair" 
                            onClick={postPost}
                        >
                            Post
                        </button>
                    </div>
                    <div 
                        style={{backgroundColor: 'var(--bar-bg)', padding: '2.5rem'}}
                        className="card body border" 
                    />
                </div>
            </div>
        </div>
    )
}
