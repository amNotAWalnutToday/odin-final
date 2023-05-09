import Comment from "../cards/Comment"
import ComposePost from "./ComposePost"
import UserSchema from "../../schemas/user"
import SubSchema from "../../schemas/sub"

type Props = {
    pageType: string,
    user: UserSchema | undefined,
    subSettings: SubSchema | undefined,
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
}

export default function CommentContainer({
        pageType, 
        user, 
        subSettings,
        checkHasJoinedSub
    }: Props) {
    return(
        <div className="post-container">
            <ComposePost
                pageType={pageType}
                user={user}
                subSettings={subSettings}
                checkHasJoinedSub={checkHasJoinedSub}
            ></ComposePost>
            <Comment></Comment>
        </div>
    )
}
