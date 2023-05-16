import { Timestamp } from "firebase/firestore";
import { Vote } from "./post";

type CommentSchema = {
    _id: string,
    message: string,
    upvotesRef: Vote[],
    upvotesNum: number, 
    timestamp: Timestamp,
    parent: string,
    poster: string,
}

export default CommentSchema;