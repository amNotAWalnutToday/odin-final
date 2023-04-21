import Post from './Post';
import CommunityList from './CommunityList';

type Props = {
    pageType: string,
}

export default function PostContainer({pageType}: Props) {

    const mapPosts = () => {
        const arr = [1, 2, 3];
        return arr.map((a, b) => {
            return <Post key={b} />
        })
    }

    return (
        <div className="post-container" >
            {pageType !== 'list' && mapPosts()}
            {pageType === 'list' && <CommunityList />}
        </div>
    )
}