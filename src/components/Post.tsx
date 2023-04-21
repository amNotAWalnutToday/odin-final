export default function Post() {
    return(
        <div className="post border" >
            <div className="rating-bar">
                <button>up</button>
                <p>0</p>
                <button>do</button>
            </div>
            <div className="post-main">
                <div className="post-top">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p style={{fontSize: '0.8em'}} >
                            <span style={{fontWeight: 'bold'}}>{'sub/thissub'}</span> . posted by {'u/thisuser'} {'some hours ago'}</p>
                        <button>Join</button>
                    </div>
                    <h3>Lorem ipsum dolor sit, amet consectetur adipisicing.</h3>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum repellendus, non modi quas odit deserunt. Reiciendis, ab explicabo voluptatum ad odio esse aperiam nemo nostrum provident, at rem repellendus iste ratione mollitia in earum hic commodi exercitationem aut maiores perferendis doloremque deleniti. Quasi qui atque nam dolores officiis? Possimus, laboriosam?</p>
                </div>
                <div className="post-bottom">
                    <span>ico </span>
                    <button>000 Comments</button>
                </div>
            </div>
        </div>
    )
}
