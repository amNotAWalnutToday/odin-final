import PostSchema from "../../schemas/post";
import { Vote } from "../../schemas/post";
import CommentSchema from '../../schemas/comment';

type Props = {
    post: PostSchema | undefined,
    comment: CommentSchema | undefined,
    handleVote: (isUpvote: boolean) => Promise<void>,
    sumVotes: ((post: PostSchema) => number) | undefined,
    checkIfUpvote: (votes: Vote[]) => "" | "upvote" | "downvote" | undefined,
    barSettings: {
        isVertical: boolean, 
        replyBtn: {
            hasBtn: boolean,
            btnClick: (() => void) | undefined,
        },
        hideBtn: {
            hasBtn: boolean,
            btnClick: (() => void) | undefined,
        }
    }
}

export default function RatingBar({
        post, 
        comment, 
        handleVote, 
        sumVotes, 
        checkIfUpvote,
        barSettings,
    }: Props) {
    return(
        <div className={`
                    rating-bar 
                    ${barSettings.isVertical ? 'flex-col' : ''}
                    ${barSettings.replyBtn.hasBtn ? 'comment-btn' : ''}
                `
            }>
            <button 
                className={`arrow-thick rot90 ${checkIfUpvote(post ? post.upvotes : comment ? comment.upvotesRef : [] as Vote[]) === 'upvote' ? 'pseudo-select' : ''}`} 
                onClick={() => handleVote(true)} 
            />
            <strong>
                {(post && sumVotes) && sumVotes(post)}
                {comment && comment.upvotesNum}
            </strong>
            <button
                className={`arrow-thick rot270 ${checkIfUpvote(post ? post.upvotes : comment ? comment.upvotesRef : [] as Vote[]) === 'downvote' ? 'pseudo-select' : ''}`} 
                onClick={() => handleVote(false)} 
            />
            {barSettings.replyBtn.hasBtn
            &&    
            <button 
                className="reply-btn line-flex borderless" 
                onClick={barSettings.replyBtn.btnClick} 
            >
                <div className="reply-btn-icon"></div>
                Reply
            </button>
            }
            {barSettings.hideBtn.hasBtn 
            &&
            <button
                className="reply-btn borderless border hpad"
                style={{paddingRight: '1rem', marginLeft: '1rem'}}
                onClick={barSettings.hideBtn.btnClick}
            >
                hide
            </button>
            }
        </div>
    )
}
