import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

export default function ComposePost() {
    return(
        <div className="content">
            <div className="post-container" >
                <div style={{padding: '0'}} className="card body rounded-border">
                    <div className="compose-post-btn-grp" >
                        <button>Post</button>
                        <button disabled >Image & Video</button>
                        <button disabled>Link</button>
                        <button disabled>Poll</button>
                    </div>
                    <div className="post-main body">
                        <input
                            style={{backgroundColor: 'var(--box-bg)'}}
                            className="border"
                            type="text"
                            placeholder='Title'
                        />
                        <ReactQuill />
                        <button 
                            style={{alignSelf: 'flex-end'}}
                            className="btn flair" 
                        >
                            Post
                        </button>
                    </div>
                    <div 
                        style={{backgroundColor: 'var(--bar-bg)', padding: '2.5rem'}}
                        className="card body border" 
                    />
                </div>
            </div>
        </div>
    )
}
