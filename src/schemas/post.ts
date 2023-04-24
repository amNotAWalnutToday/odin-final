import { Timestamp } from "firebase/firestore";
import UserSchema from "./user";

type PostSchema = {
    _id: string,
    title: string,
    message: string,
    upvotes: number,
    timestamp: Timestamp,
    parent: string,
    poster: UserSchema,
}

export default PostSchema;
