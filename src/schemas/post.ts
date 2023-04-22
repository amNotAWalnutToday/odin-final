import UserSchema from "./user";

type PostSchema = {
    _id: string,
    title: string,
    message: string,
    upvotes: number,
    timestamp: Date,
    parent: string,
    poster: UserSchema,
}

export default PostSchema;
