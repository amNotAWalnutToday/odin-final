import { 
    query,
    getDocs,
    collection
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Comment from "../cards/Comment"
import ComposePost from "./ComposePost"
import { db } from '../../RouteSwitch';
import UserSchema from "../../schemas/user"
import SubSchema from "../../schemas/sub"
import PostSchema from '../../schemas/post';
import CommentSchema from '../../schemas/comment';

type Props = {
    pageType: string,
    user: UserSchema | undefined,
    postForComments: PostSchema,
    setPosts: React.Dispatch<React.SetStateAction<PostSchema[]>>,
    subSettings: SubSchema | undefined,
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
}

export default function CommentContainer({
        pageType, 
        user,
        postForComments, 
        setPosts,
        subSettings,
        checkHasJoinedSub
    }: Props) {
    const { sub, post } = useParams();
    
    const [viewableComments, setViewableComments] = useState<CommentSchema[]>(); 
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const commentUrl = `posts/${post}/comments`;
    const composePostProps = {
        pageType,
        user,
        postForComments,
        setPosts,
        subSettings,
        checkHasJoinedSub,
        commentUrl,
        setIsPosting
    }

    useEffect(() => {
        getComments(commentUrl, setViewableComments);
        console.log(post);
        /*eslint-disable-next-line*/
    }, [post, isPosting]);

    const getComments = async (
        queryUrl: string, 
        setter: React.Dispatch<React.SetStateAction<CommentSchema[] | undefined>>
    ) => {
        setIsPosting(false);
        const commentQuery = query(
            collection(db, queryUrl),
        );
        const snapshot = await getDocs(commentQuery);
        const commentData: any = [];
        snapshot.forEach(comment => {
            commentData.push({_id: comment.id, ...comment.data()});
        })
        setter(commentData);
    }

    const mapComments = (mappableComments: CommentSchema[]) => {
        return mappableComments.map((comment, ind) => {
            return (
                <Comment 
                    key={`comment-${ind}`}
                    comment={comment}
                    commentUrl={commentUrl}
                    getComments={getComments}
                    mapComments={mapComments}
                    composePostProps={composePostProps}
                />
            )
        })
    }

    return(
        <div className="post-container comment-container border">
            <ComposePost
                {...composePostProps}
            ></ComposePost>
            <div className="post-container comment-container comment-list hpad" style={{alignSelf: 'flex-start'}}>
                {mapComments(viewableComments ?? [])}
            </div>
        </div>
    )
}
