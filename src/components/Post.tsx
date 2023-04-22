import PostSchema from "../schemas/post"

type Props = {
    post: PostSchema,
    pageType: string,
}

export default function Post({post, pageType}: Props) {
    return(
        <div className="post border" >
            <div className="rating-bar">
                <button>up</button>
                <p>{post.upvotes}</p>
                <button>do</button>
            </div>
            <div className="post-main">
                <div className="post-top">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p className="text-trivial" style={{fontSize: '0.8em'}} >
                            <span style={{color: 'black', fontWeight: 'bold'}}>
                                {pageType !== 'sub' && `sub/${post.parent.replace(' ', '')} `}
                            </span> 
                            posted by {'u/thisuser'} {'some hours ago'}</p>
                        <button className="btn flair">Join</button>
                    </div>
                    <h3>{post.title}</h3>
                </div>
                <p>{post.message}</p>
                <div className="post-bottom">
                    <span>ico </span>
                    <button>000 Comments</button>
                </div>
            </div>
        </div>
    )
}
