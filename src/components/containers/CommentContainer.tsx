import { 
    query,
    getDocs,
    collection,
    orderBy,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Comment from "../cards/Comment"
import ComposePost from "./ComposePost"
import { db } from '../../RouteSwitch';
import UserSchema from "../../schemas/user"
import SubSchema from "../../schemas/sub"
import PostSchema from '../../schemas/post';
import { Vote } from '../../schemas/post';
import CommentSchema from '../../schemas/comment';

type Props = {
    pageType: string,
    user: UserSchema | undefined,
    postForComments: PostSchema,
    setPosts: React.Dispatch<React.SetStateAction<PostSchema[]>>,
    subSettings: SubSchema | undefined,
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
    checkIfUpvote: (votes: Vote[]) => "" | "upvote" | "downvote" | undefined,
    toggleLoginForm: () => void,
}

export default function CommentContainer({
        pageType, 
        user,
        postForComments, 
        setPosts,
        subSettings,
        checkHasJoinedSub,
        checkIfUpvote,
        toggleLoginForm,
    }: Props) {
    const { post } = useParams();
    
    const [viewableComments, setViewableComments] = useState<CommentSchema[]>([]); 
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
        setIsPosting,
        toggleLoginForm,
    }

    useEffect(() => {
        setTimeout(() => getComments(commentUrl, setViewableComments), 500);
        /*eslint-disable-next-line*/
    }, [post, isPosting]);

    const getComments = async (
        queryUrl: string, 
        setter: React.Dispatch<React.SetStateAction<CommentSchema[]>>
    ) => {
        setIsPosting(false);
        const commentQuery = query(
            collection(db, queryUrl),
            orderBy("upvotesNum", "desc"),
        );
        const snapshot = await getDocs(commentQuery);
        const commentData: any = [];
        snapshot.forEach(comment => {
            commentData.push({_id: comment.id, ...comment.data()});
        })
        setter(commentData);
    }

    const mapComments = (
        mappableComments: CommentSchema[],
        updatedCommentUrl: string,
        setter: React.Dispatch<React.SetStateAction<CommentSchema[]>>
    ) => {
        return mappableComments.map((comment, ind) => {
            return (
                <Comment 
                    key={`comment-${ind}`}
                    comment={comment}
                    comments={mappableComments}
                    setComments={setter}
                    commentUrl={updatedCommentUrl}
                    getComments={getComments}
                    mapComments={mapComments}
                    composePostProps={composePostProps}
                    checkIfUpvote={checkIfUpvote}
                />
            )
        })
    }

    return(
        <div className="post-container comment-container border">
            <ComposePost
                {...composePostProps}
            />
            <div className="post-container comment-container comment-list hpad" style={{alignSelf: 'flex-start'}}>
                {mapComments(
                    viewableComments ?? [],
                    commentUrl, 
                    setViewableComments,
                )}
            </div>
        </div>
    )
}
