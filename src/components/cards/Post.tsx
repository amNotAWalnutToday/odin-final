import { updateDoc, doc, Timestamp, collection, where, getDocs, query } from 'firebase/firestore';
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
    joinSub: (subSlice: SubSchema) => void,
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
}

export default function Post({
        post, 
        posts, 
        setPosts, 
        user, 
        pageType,
        joinSub,
        checkHasJoinedSub,
    }: Props) {
    const convertTime = (timestamp: Timestamp | undefined) => {
        const date = timestamp?.toDate().toDateString().split(' ');
        date?.shift();
        return date?.join(' ');
        // change later,  this is a duplicate function from sidebarCard.tsx */
        // should check for how long ago the message was posted             */
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
    
    const sumVotes = ():number => {
        let [upv, downv] = [0, 0];
        for(const vote of post.upvotes) {
            vote.isUpvote ? upv++ : downv++
        }
        return upv - downv;
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

    return(
        <div className="post border" >
            <div className="rating-bar">
                <button 
                    className={`arrow-thick rot90 ${checkIfUpvote() === 'upvote' ? 'pseudo-select' : ''}`} 
                    onClick={() => handleVote(true)} 
                />
                <b>{sumVotes()}</b>
                <button
                    className={`arrow-thick rot270 ${checkIfUpvote() === 'downvote' ? 'pseudo-select' : ''}`} 
                    onClick={() => handleVote(false)} 
                />
            </div>
            <div className="post-main">
                <div className="post-top">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p className="text-trivial" style={{fontSize: '0.8em'}} >
                            <span style={{color: 'black', fontWeight: 'bold'}}>
                                {pageType !== 'sub' && `sub/${post.parent.replace(' ', '')} `}
                            </span> 
                            posted by {`u/${post.poster}`} {`on ${convertTime(post.timestamp)}`}</p>
                    </div>
                    <h3>{post.title}</h3>
                </div>
                <div className='htmlrevert' >
                    {parse(post.message)}
                </div>
                <div className="post-bottom">
                    <span>ico </span>
                    <button>000 Comments</button>
                </div>
            </div>
        </div>
    )
}
