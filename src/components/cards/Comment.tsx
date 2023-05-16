import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react"
import parse from 'html-react-parser';
import CommentSchema from "../../schemas/comment"
import ComposePost from "../containers/ComposePost";
import { Props as ComposePostProps } from '../containers/ComposePost';

type Props = {
    comment: CommentSchema,
    commentUrl: string, 
    getComments: (
        queryUrl: string, 
        setter: React.Dispatch<React.SetStateAction<CommentSchema[] | undefined>>
    ) => Promise<void>,
    mapComments: any,
    composePostProps: ComposePostProps,
}

export default function Comment({
        comment, 
        commentUrl, 
        getComments,
        mapComments,
        composePostProps
    }: Props) {
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const toggleIsReplying = () => setIsReplying(!isReplying);
    const [viewableComments, setViewableComments] = useState<CommentSchema[]>();
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const updatedCommentUrl = `${commentUrl}/${comment._id}/comments`;

    useEffect(() => {
        getComments(updatedCommentUrl, setViewableComments);
        console.log(comment);
    }, [isPosting]);

    const convertTime = (timestamp: Timestamp | undefined) => {
        const date = timestamp?.toDate().toDateString().split(' ');
        date?.shift();
        return date?.join(' ');
        // change later,  this is a duplicate function from sidebarCard.tsx */
        // should check for how long ago the message was posted             */
        // post needs a copy of this when done                              */ 
    }

    const toggleAfterSetIsPosting = (bool: boolean) => {
        setIsPosting(bool);
        toggleIsReplying();
    }

    return(
        <div className="left-border comment" >
            <div className="comment-main" >
                <span className="line-flex" >
                    <strong>{composePostProps.user?.name}</strong>
                    <span className="text-trivial" >
                        {' '}{convertTime(comment.timestamp)}
                    </span>
                </span>
                <span className="hpad htmlrevert">
                    {parse(comment.message)}
                </span>
            </div>
            <div className="" style={{alignSelf: 'flex-start'}} >
                {isReplying
                &&
                <ComposePost
                    {...composePostProps}
                    commentUrl={updatedCommentUrl}
                    setIsPosting={toggleAfterSetIsPosting}
                />
                }
            </div>
            <button 
                className="flair btn comment-btn comment-main"
                onClick={toggleIsReplying}
            >
                :Re
            </button>
            <div 
                className="comment-list flex-col"
            >
                {mapComments(viewableComments ?? [])}
            </div>
        </div>
    )
}