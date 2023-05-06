import { query, getDocs, collection, where } from 'firebase/firestore';
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
        if(pageType !== 'sub' || !subSettings) return setPosts([]);
        const postQuery = query(
            collection(db, 'posts'),
            where('parent', '==', subSettings?.name)
        );
        const snapshot = await getDocs(postQuery);
        const postData: any[] = [];
        snapshot.forEach((post) => {
            const newPost = {
                _id: post.id,
                ...post.data()
            };
            postData.push(newPost);
        });
        setPosts(postData);
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