import { 
    updateDoc, 
    doc, 
    Timestamp, 
    collection, 
    where, 
    getDocs, 
    query 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import PostSchema from "../../schemas/post";
import { Vote } from '../../schemas/post';
import { db } from '../../RouteSwitch';
import UserSchema from '../../schemas/user';
import SubSchema from '../../schemas/sub';

type Props = {
    post: PostSchema,
    posts: PostSchema[],
    setPosts: React.Dispatch<React.SetStateAction<PostSchema[]>>,
    user: UserSchema | undefined,
    pageType: string,
    sumVotes: (post: PostSchema) => number,
    joinSub: (subSlice: SubSchema) => void,
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
}

export default function Post({
        post, 
        posts, 
        setPosts, 
        user, 
        pageType,
        sumVotes,
        joinSub,
        checkHasJoinedSub,
    }: Props) {
    const navigate = useNavigate();

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

    const checkIfUpvote = () => {
        if(!user) return '';
        const upvotes = post.upvotes;
        for(const voter of upvotes) {
            if(voter.user === user.email) {
                return voter.isUpvote ? 'upvote' : 'downvote';
            }
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
            <div className="rating-bar">
                <button 
                    className={`arrow-thick rot90 ${checkIfUpvote() === 'upvote' ? 'pseudo-select' : ''}`} 
                    onClick={() => handleVote(true)} 
                />
                <b>{sumVotes(post)}</b>
                <button
                    className={`arrow-thick rot270 ${checkIfUpvote() === 'downvote' ? 'pseudo-select' : ''}`} 
                    onClick={() => handleVote(false)} 
                />
            </div>
            <div 
                className={`post-main ${pageType !== 'post' ? 'hover' : ''}`} 
                onClick={pageType !== 'post' ? () => navigate(`/r/${post.parent}/${post._id}/comments`) : undefined} 
            >
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
                    className={`htmlrevert ${pageType !== 'post' ? 'post-fixed' : ''}`} 
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
                    <p className='text-trivial text-link' >
                        <span>ico </span>
                        {post?.amountOfComments ?? 0} Comments
                    </p>
                    <div className='fadeout'></div>
                </div>
            </div>
        </div>
    )
}
