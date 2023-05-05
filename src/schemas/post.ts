import { Timestamp } from "firebase/firestore";
import UserSchema from "./user";

export interface Vote {
    user: string,
    isUpvote: boolean,
}

type PostSchema = {
    _id: string,
    title: string,
    message: string,
    upvotes: Vote[],
    timestamp: Timestamp,
    parent: string,
    poster: UserSchema,
}

export default PostSchema;
