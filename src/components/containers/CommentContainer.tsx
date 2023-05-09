import { 
    query,
    where,
    getDocs,
    collection
} from 'firebase/firestore';
import Comment from "../cards/Comment"
import ComposePost from "./ComposePost"
import { db } from '../../RouteSwitch';
import UserSchema from "../../schemas/user"
import SubSchema from "../../schemas/sub"
import PostSchema from '../../schemas/post';

type Props = {
    pageType: string,
    user: UserSchema | undefined,
    post: PostSchema,
    setPosts: React.Dispatch<React.SetStateAction<PostSchema[]>>,
    subSettings: SubSchema | undefined,
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
}

export default function CommentContainer({
        pageType, 
        user,
        post, 
        setPosts,
        subSettings,
        checkHasJoinedSub
    }: Props) {
    const getComments = () => {

    }

    return(
        <div className="post-container">
            <ComposePost
                pageType={pageType}
                user={user}
                postForComments={post}
                setPosts={setPosts}
                subSettings={subSettings}
                checkHasJoinedSub={checkHasJoinedSub}
            ></ComposePost>
            <Comment></Comment>
        </div>
    )
}
