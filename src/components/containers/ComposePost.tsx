import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { useState } from "react";
import { db } from "../../RouteSwitch";
import SubDropdown from "../other/SubDropdown";
import UserSchema from "../../schemas/user";
import SubSchema from "../../schemas/sub";

type Props = {
    pageType: string,
    user: UserSchema | undefined,
    subSettings: SubSchema | undefined,
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
}

export default function ComposePost({pageType, user, subSettings, checkHasJoinedSub}: Props) {
    const navigate = useNavigate();
    const { sub } = useParams();
    const [tab, setTab] = useState<string>('post');
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
            if(!user) throw console.error('must be signed in');
            if(subSettings && !checkHasJoinedSub(subSettings)) throw console.error("Must Join Sub");
            if(!sub || !subSettings) throw console.error("No sub selected to post to!");
            const newPost = {
                title: postDetails.title,
                message: tab === 'link' 
                    ? `<a href=${[postDetails.post]}>${postDetails.post}</a>` 
                    : postDetails.post,
                upvotes: [],
                timestamp: Timestamp.now(),
                parent: sub,
                poster: user.name,
                isLink: tab === 'link'
            }
            await addDoc(collection(db, "posts"), newPost);
            navigate(`/r/${subSettings.name}`);
        } catch(e) {
            console.error(e, 'Could not Post');
        }
    }

    return(
        <div>
            <SubDropdown 
                pageType={pageType}
            />
            <div className="post-container" >
                <div style={{padding: '0'}} className="card body rounded-border">
                    <div className="compose-post-btn-grp" >
                        <button 
                            className={tab === 'post' ? 'pseudo-select' : '' }
                            onClick={() => setTab('post')}
                        >
                            Post
                        </button>
                        <button disabled>Image & Video</button>
                        <button 
                            className={tab === 'link' ? 'pseudo-select': '' }
                            onClick={() => setTab('link')}
                        >
                            Link
                        </button>
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
                        {tab === 'post'
                        &&
                        <ReactQuill 
                            className="htmlrevert"
                            placeholder="Text(required)"
                            onChange={postHandler}
                        />
                        }
                        {tab === 'link'
                        &&
                        <textarea 
                            className="border"
                            placeholder="E.g link from imgur, it will show the link and the image"
                            onChange={(e) => postHandler(e.target.value)}
                        />
                        }
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
