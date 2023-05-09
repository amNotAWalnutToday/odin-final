import { Timestamp } from "firebase/firestore";
import { Vote } from "./post";
import UserSchema from "./user";

type CommentSchema = {
    _id: string,
    message: string,
    upvotes: Vote[],
    timestamp: Timestamp,
    parent: string,
    poster: UserSchema,
}

export default CommentSchema;