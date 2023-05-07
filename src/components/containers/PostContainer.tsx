import { 
    query,
    getDocs, 
    collection, 
    where, 
    limit, 
    orderBy 
} from 'firebase/firestore';
import { db } from '../../RouteSwitch';
import { useEffect, useState } from 'react';
import Post from '../cards/Post';
import CommunityList from './CommunityList';
import CreatePostBar from '../other/CreatePostBar';
import SubSchema from '../../schemas/sub';
import PostSchema from '../../schemas/post';
import UserSchema from '../../schemas/user';

type Props = {
    pageType: string,
    user: UserSchema | undefined,
    subSettings: SubSchema | undefined,
    subs: SubSchema[],
    setSubs: React.Dispatch<React.SetStateAction<SubSchema[]>>,
    joinSub: (subSlice: SubSchema) => void,
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
}

export default function PostContainer({
        pageType, 
        user,
        subSettings, 
        subs, 
        setSubs,
        joinSub,
        checkHasJoinedSub,
    }: Props) {
    const [posts, setPosts] = useState<PostSchema[]>([]);
    
    useEffect(() => {
        getPosts();
        /*eslint-disable-next-line*/
    }, [pageType, subSettings]);

    const getPosts = async () => {
        if((pageType !== 'sub' && pageType !== 'home')) return setPosts([]);
        let postQuery;
        if(pageType === 'home') {
            postQuery = query(
                collection(db, 'posts'),
                limit(50),
                orderBy("timestamp", 'desc')
            )
        } else {
            if(!subSettings) return setPosts([]);
            postQuery = query(
                collection(db, 'posts'),
                where('parent', '==', subSettings?.name),
                limit(100),
                orderBy("timestamp", 'desc'),
            );
        }
        const snapshot = await getDocs(postQuery);
        let postData: any[] = [];
        snapshot.forEach((post) => {
            const newPost = {
                _id: post.id,
                ...post.data()
            };
            postData.push(newPost);
        });
        if(pageType === 'home') postData = sortPostsByUpvotes(postData);
        setPosts(postData);
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
                    user={user}
                    pageType={pageType} 
                    sumVotes={sumVotes}
                    joinSub={joinSub}
                    checkHasJoinedSub={checkHasJoinedSub}
                />
            )
        })
    }

    return (
        <div className="post-container" >
            {(pageType !== 'list' && pageType !== 'submit' && user)
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
        </div>
    )
}