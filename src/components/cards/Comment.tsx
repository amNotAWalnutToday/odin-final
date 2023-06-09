import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react"
import parse from 'html-react-parser';
import { db } from "../../RouteSwitch";
import { Vote } from "../../schemas/post";
import CommentSchema from "../../schemas/comment"
import RatingBar from "../other/RatingBar";
import ComposePost from "../containers/ComposePost";
import { Props as ComposePostProps } from '../containers/ComposePost';

type Props = {
    comment: CommentSchema,
    comments: CommentSchema[],
    setComments: React.Dispatch<React.SetStateAction<CommentSchema[]>>,
    commentUrl: string, 
    getComments: (
        queryUrl: string, 
        setter: React.Dispatch<React.SetStateAction<CommentSchema[]>>
    ) => Promise<void>,
    mapComments: (
        mappableComments: CommentSchema[], 
        updatedCommentUrl: string,
        setter: React.Dispatch<React.SetStateAction<CommentSchema[]>>
    ) => JSX.Element[],
    composePostProps: ComposePostProps,
    checkIfUpvote: (votes: Vote[]) => "" | "upvote" | "downvote" | undefined,
}

export default function Comment({
        comment, 
        comments,
        setComments,
        commentUrl, 
        getComments,
        mapComments,
        composePostProps,
        checkIfUpvote
    }: Props) {
    const commentContainer = useRef<HTMLDivElement>(null);

    const [isHiding, setIsHiding] = useState<boolean>(true);
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const toggleIsReplying = () => setIsReplying(!isReplying);
    const [viewableComments, setViewableComments] = useState<CommentSchema[]>([]);
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const updatedCommentUrl = `${commentUrl}/${comment._id}/comments`;

    useEffect(() => {
        if(isHiding) return;
        getComments(updatedCommentUrl, setViewableComments);
        /*eslint-disable-next-line*/
    }, [isPosting, isHiding]);

    useMemo(() => {
        const isTooDeep = updatedCommentUrl.split("/").length;
        isTooDeep >= 13 ? setIsHiding(() => true) : setIsHiding(() => false);
    }, [updatedCommentUrl]);

    const convertTime = (timestamp: Timestamp | undefined) => {
        const date = timestamp?.toDate().toDateString().split(' ');
        date?.shift();
        return date?.join(' ');
        // change later,  this is a duplicate function from sidebarCard.tsx */
        // should check for how long ago the message was posted             */
        // post needs a copy of this when done                              */ 
    }

    const toggleAfterSetIsPosting = (bool: boolean) => {
        setIsPosting((b) => !b);
        toggleIsReplying();
    }

    const checkForVoter = (upvotes: Vote[]) => {
        if(!composePostProps.user) return false;
        for(const voter of upvotes) {
            if(voter.user === composePostProps.user.uid) return true;
        }
    }

    const getDocUrl = (url: string) => {
        const docUrl = [];
        let urlArr = url.split("/");
        if(docUrl.length) return '';
        urlArr.shift();
        docUrl.push(urlArr.join("/"));
        return docUrl.join("/").concat(`/${comment._id}`);
    }

    const handleVote = async (isUpvote: boolean) => {
        try { 
            const commentSlice = [...comments];
            let thisComment;
            for(const anyComment of commentSlice) {
                if(anyComment._id === comment._id) thisComment = anyComment;
            }
            const docUrl = getDocUrl(commentUrl);
            if(!thisComment || !composePostProps.user || !docUrl) throw Error;
            if(checkForVoter(thisComment.upvotesRef)) {
                const ind = thisComment.upvotesRef.findIndex((c) => c.user === composePostProps?.user?.uid);
                const voterRef = thisComment.upvotesRef.splice(ind, 1)[0];
                thisComment.upvotesNum += voterRef.isUpvote ? -1 : 1;
            } else {
                const thisVote = {user: composePostProps.user.uid, isUpvote};
                thisComment.upvotesRef.push(thisVote);
                thisComment.upvotesNum += isUpvote ? 1 : -1;
            }
            await updateDoc(doc(db, 'posts', docUrl), thisComment);
            setComments(commentSlice);
        } catch(err) {
            console.error(err);
        }
    }

    return !isHiding ? (
        <div className="left-border comment" ref={commentContainer}>
            <div className="comment-main" >
                <span className="line-flex" >
                    <strong>{comment.poster}</strong>
                    <span className="text-trivial" style={{width: "20%"}}>
                        {' '}{convertTime(comment.timestamp)}
                    </span>
                </span>
                <pre className="hpad htmlrevert flex-col">
                    {parse(comment.message)}
                </pre>
            </div>
            {<RatingBar
                post={undefined}
                comment={comment}
                handleVote={handleVote}
                sumVotes={undefined}
                checkIfUpvote={checkIfUpvote}
                barSettings={{
                    isVertical: false, 
                    replyBtn: {
                        hasBtn: true,
                        btnClick: toggleIsReplying,
                    },
                    hideBtn: {
                        hasBtn: updatedCommentUrl.split("/").length >= 13,
                        btnClick: () => setIsHiding(b => !b),
                    },
                }}
            />
            }
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
            <div 
                className="comment-list flex-col"
                data-comment
                data-hide={isHiding ? true : false}
            >
                {mapComments(
                    viewableComments ?? [], 
                    updatedCommentUrl,
                    setViewableComments,
                )}
            </div>
        </div>
    ) : (
        <>
            <div
                className="comment-list flex-col width100"
            >
                <button className="btn flair btn-input-bg"
                    onClick={() => setIsHiding(b => !b)}
                >
                    Show
                </button>
                {mapComments(
                    viewableComments ?? [],
                    updatedCommentUrl,
                    setViewableComments,
                )}
            </div>
        </>
    )
}