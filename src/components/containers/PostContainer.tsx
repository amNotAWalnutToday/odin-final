import { query, getDocs, collection, where } from 'firebase/firestore';
import { db } from '../../RouteSwitch';
import { useEffect, useState } from 'react';
import Post from '../cards/Post';
import CommunityList from './CommunityList';
import CreatePostBar from '../other/CreatePostBar';
import SubSchema from '../../schemas/sub';
import PostSchema from '../../schemas/post';

type Props = {
    pageType: string,
    subSettings: SubSchema | undefined,
    subs: SubSchema[],
    setSubs: React.Dispatch<React.SetStateAction<SubSchema[]>>,
}

export default function PostContainer({pageType, subSettings, subs, setSubs}: Props) {
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
        console.log('a');
    }

    const mapPosts = () => {
        return posts.map((post, ind) => {
            return <Post key={ind} post={post} pageType={pageType} />
        })
    }

    return (
        <div className="post-container" >
            {(pageType !== 'list' && pageType !== 'submit') && <CreatePostBar />}
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