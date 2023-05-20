import { 
    updateDoc, 
    deleteDoc,
    doc, 
    Timestamp, 
    collection, 
    where, 
    getDocs, 
    query, 
} from 'firebase/firestore';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import RatingBar from '../other/RatingBar';
import { db } from '../../RouteSwitch';
import PostSchema from "../../schemas/post";
import { Vote } from '../../schemas/post';
import UserSchema from '../../schemas/user';
import SubSchema from '../../schemas/sub';

type Props = {
    post: PostSchema,
    posts: PostSchema[],
    setPosts: React.Dispatch<React.SetStateAction<PostSchema[]>>,
    subSettings: SubSchema | undefined,
    user: UserSchema | undefined,
    pageType: string,
    sumVotes: (post: PostSchema) => number,
    joinSub: (subSlice: SubSchema) => void,
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
    checkIfUpvote: (votes: Vote[]) => "" | "upvote" | "downvote" | undefined
}

export default function Post({
        post, 
        posts, 
        setPosts, 
        subSettings,
        user, 
        pageType,
        sumVotes,
        joinSub,
        checkHasJoinedSub,
        checkIfUpvote,
    }: Props) {
    const navigate = useNavigate();
    const { sub } = useParams();
    const postElementRef = useRef<HTMLDivElement>(null);
    const [shouldFade, setShouldFade] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            const postHeight = postElementRef.current?.offsetHeight ?? 0;
            postHeight > 399 && pageType !== 'post'
                ? setShouldFade(true)
                : setShouldFade(false);
        }, 300);
    }, [sub, pageType]);

    const convertTime = (timestamp: Timestamp | undefined) => {
        const date = timestamp?.toDate().toDateString().split(' ');
        date?.shift();
        return date?.join(' ');
        // change later,  this is a duplicate function from sidebarCard.tsx */
        // should check for how long ago the message was posted             */
        // comment needs a copy of this when done                           */ 
    }

    const checkForVoter = (upvotes: Vote[]) => {
        if(!user) return false;
        for(const voter of upvotes) {
            if(voter.user === user.email) return true;
        }
    }
    
    const handleVote = async (isUpvote: boolean) => {
        try {
            const postSlice = [...posts];
            let thisPost;
            for(const anyPost of postSlice) {
                if(anyPost._id === post._id) thisPost = anyPost;
            }
            if(!thisPost || !user) throw Error;
            if(checkForVoter(post.upvotes)) {
                const ind = thisPost.upvotes.findIndex((p) => p.user === user.email);
                thisPost.upvotes.splice(ind, 1);
            } else {
                thisPost.upvotes.push({user: user.email, isUpvote});
            }
            await updateDoc(doc(db, 'posts', post._id), thisPost);
            setPosts(postSlice);
        } catch(err) {
            console.error(err);
        }
    }

    const removePost = async () => {
        try {
            if(!user || (user.email !== subSettings?.creator)) throw Error;
            const postSlice = [...posts];
            const thisPostInd = postSlice.findIndex((p) => p._id === post._id);
            postSlice.splice(thisPostInd, 1);

            await deleteDoc(doc(db, "posts", post._id));
            setPosts((prevPosts) => [...postSlice]);
        } catch(err) {
            console.error(err);
        }
    }

    /*eslint-disable-next-line*/
    const populateParent = async () => {
        try {
            const subQuery = query(
                collection(db, 'subs'),
                where('name', '==', post.parent)
            );
            const snapshot = await getDocs(subQuery);
            let thisSub;
            snapshot.forEach((s) => {
                thisSub = s.data();
            });
            return thisSub;
        } catch(err) {
            console.error(err);
        }
    }

    const removeAnchors = (text: string) => {
        const a1 = text.split(">")[1];
        if(!a1) return; 
        const a2 = a1.split('<')[0];
        return a2;
    }

    return(
        <div className="post border" >
            <RatingBar
                post={post}
                comment={undefined}
                handleVote={handleVote}
                sumVotes={sumVotes}
                checkIfUpvote={checkIfUpvote}
                barSettings={{
                    isVertical: true, 
                    replyBtn: {
                        hasBtn: false, 
                        btnClick: undefined
                    },
                    hideBtn: {
                        hasBtn: false,
                        btnClick: undefined,
                    },
                }}
            />
            <div className={`post-main`}>
                <div className="post-top">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p className="text-trivial" style={{fontSize: '0.8em'}} >
                            <span 
                                className='text-imp-b text-link' 
                                onClick={() => navigate(`/r/${post.parent}`)}
                            >
                                {pageType !== 'sub' && `r/${post.parent.replace(' ', '')} `}
                            </span> 
                            {'posted by '} 
                            <span 
                                className='text-link'
                                onClick={() => navigate(`/u/${post.poster}`)}
                            >
                                {`u/${post.poster}`} 
                            </span>
                            {` on ${convertTime(post.timestamp)}`}</p>
                    </div>
                    <h3>{post.title}</h3>
                </div>
                <div 
                    ref={postElementRef}
                    className={`htmlrevert ${pageType !== 'post' ? 'post-fixed' : ''}  ${pageType !== 'post' ? 'hover' : ''}`} 
                    onClick={pageType !== 'post' ? () => navigate(`/r/${post.parent}/${post._id}/comments`) : undefined} 
                >
                    {parse(post.message)}
                    {post.isLink
                    &&
                    <img 
                        className='post-img' 
                        src={removeAnchors(post.message)} 
                        alt="" 
                    />
                    }                    
                </div>
                <div className="post-bottom">
                {(user?.email === subSettings?.creator && pageType === 'sub')
                    &&
                    <button 
                        className='btn-input-bg btn flair remove-btn'
                        onClick={removePost}
                    >
                        Remove
                    </button>}
                    <p 
                        className='text-trivial text-link line-flex' 
                        onClick={pageType !== 'post' ? () => navigate(`/r/${post.parent}/${post._id}/comments`) : undefined} 
                    >
                        <span className="reply-btn-icon" />
                        {post?.amountOfComments ?? 0} Comments
                    </p>
                    {shouldFade && <div className='fadeout' />}
                </div>
            </div>
        </div>
    )
}
