import { 
    query,
    doc,
    getDoc,
    getDocs, 
    collection, 
    where, 
    limit, 
    orderBy,
    startAfter,
} from 'firebase/firestore';
import { db } from '../../RouteSwitch';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../cards/Post';
import CommunityList from './CommunityList';
import CreatePostBar from '../other/CreatePostBar';
import CommentContainer from './CommentContainer';
import SubSchema from '../../schemas/sub';
import PostSchema from '../../schemas/post';
import { Vote } from '../../schemas/post';
import UserSchema from '../../schemas/user';

type Props = {
    pageType: string,
    user: UserSchema | undefined,
    subSettings: SubSchema | undefined,
    subs: SubSchema[],
    setSubs: React.Dispatch<React.SetStateAction<SubSchema[]>>,
    joinSub: (subSlice: SubSchema) => void,
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
    toggleLoginForm: () => void,
}

export default function PostContainer({
        pageType, 
        user,
        subSettings, 
        subs, 
        setSubs,
        joinSub,
        checkHasJoinedSub,
        toggleLoginForm,
    }: Props) {
    const [posts, setPosts] = useState<PostSchema[]>([]);
    const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
    const [lastVisible, setLastVisible] = useState<any>();

    const { username, post } = useParams();
    
    useEffect(() => {
        if(pageType === 'post') getSinglePost();
        getPosts();
        /*eslint-disable-next-line*/
    }, [pageType, subSettings]);

    const getPostQuery = (isFirst: boolean) => {
        const [FSCol, limitNum, order] = [
            collection(db, 'posts'),
            limit(10),
            orderBy('timestamp', 'desc'),
        ];
        let postQuery = query(FSCol);

        if(isFirst) {
            if(pageType === 'home') {
                postQuery = query(FSCol, limitNum, order);
            } else if(pageType === 'user') {
                postQuery = query(
                    FSCol, limitNum, order,
                    where("poster", "==", username)
                );
            } else {
                postQuery = query(
                    FSCol, limitNum, order,
                    where("parent", "==", subSettings?.name)
                );
            }
        } else {
            if(pageType === 'home') {
                postQuery = query(FSCol, limitNum, order, startAfter(lastVisible));
            } else if(pageType === 'user') {
                postQuery = query(
                    FSCol, limitNum, order, startAfter(lastVisible),
                    where("poster", "==", username)
                );
            } else {
                postQuery = query(
                    FSCol, limitNum, order, startAfter(lastVisible),
                    where("parent", "==", subSettings?.name)
                );
            }
        }
        return postQuery;
    }

    const getSinglePost = async () => {
        try {
            if(pageType !== 'post' || !post) return;
            const mainPost = await getDoc(doc(db, 'posts', post));
            const postData: any = { _id: mainPost.id, ...mainPost.data()};
            setPosts([postData]);
        } catch(err) {
            console.error(err);
        }
    }

    const getPosts = async () => {
        let postData: any[] = [];
        try {
            if((pageType !== 'sub' && pageType !== 'home' && pageType !== 'user')) return setPosts([]);
            if(pageType === 'sub' && !subSettings) return setPosts([]);
            const postQuery = getPostQuery(true);
            const snapshot = await getDocs(postQuery);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1])
            snapshot.forEach((post) => {
                const newPost = {
                    _id: post.id,
                    ...post.data()
                };
                postData.push(newPost);
            });
            if(pageType === 'home') postData = sortPostsByUpvotes(postData);
            setPosts(postData);
        } catch(err) {
            console.error(err);
        } finally {
            postData.length < 10 
                ? setCanLoadMore(false)
                : setCanLoadMore(true);
        }
    }

    const loadMorePosts = async () => {
        try {
            const updatedPosts = [...posts];
            const postQuery = getPostQuery(false);
            const snapshot = await getDocs(postQuery);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            let postData: any = [];
            snapshot.forEach((post) => {
                postData.push(post.data());
            });
            postData.forEach((post: PostSchema) => updatedPosts.push(post));
            if(pageType === 'home') postData = sortPostsByUpvotes(postData);
            setPosts(updatedPosts);
        } catch(err) {
            setCanLoadMore(false);
        }
    }

    const checkIfUpvote = (votes: Vote[]) => {
        if(!user) return '';
        for(const voter of votes) {
            if(voter.user === user.uid) {
                return voter.isUpvote ? 'upvote' : 'downvote';
            }
        }
    }

    const sumVotes = (post: PostSchema):number => {
        let [upv, downv] = [0, 0];
        for(const vote of post.upvotes) {
            vote.isUpvote ? upv++ : downv++
        }
        return upv - downv;
    } 

    const sortPostsByUpvotes = (postsSlice: PostSchema[]) => {
        return postsSlice.sort((a, b) => {
            const votesA = sumVotes(a);
            const votesB = sumVotes(b);
            return votesB > votesA ? 1 : -1
        });
    }

    const mapPosts = () => {
        return posts.map((post, ind) => {
            return (
                <Post 
                    key={ind} 
                    post={post}
                    posts={posts}
                    setPosts={setPosts}
                    subSettings={subSettings}
                    user={user}
                    pageType={pageType} 
                    sumVotes={sumVotes}
                    joinSub={joinSub}
                    checkHasJoinedSub={checkHasJoinedSub}
                    checkIfUpvote={checkIfUpvote}
                />
            )
        })
    }

    return (
        <div className="post-container" >
            {(pageType !== 'list' && pageType !== 'submit' 
            && pageType !== 'user' && pageType !== 'post' && user)
            && 
            <CreatePostBar />
            }
            {pageType !== 'list' && mapPosts()}
            {pageType === 'list' 
            && 
            <CommunityList 
                subs={subs}
                setSubs={setSubs}
            />
            }
            {(pageType !== 'list' &&  canLoadMore)
            &&
            <button 
                className='btn orange-bg'
                onClick={loadMorePosts}
            >
                Load More
            </button>}
            {pageType === 'post'
            &&
            <CommentContainer 
                pageType={pageType}
                user={user}
                postForComments={posts[0]}
                setPosts={setPosts}
                subSettings={subSettings}
                checkHasJoinedSub={checkHasJoinedSub}
                checkIfUpvote={checkIfUpvote}
                toggleLoginForm={toggleLoginForm}
            />
            }
        </div>
    )
}