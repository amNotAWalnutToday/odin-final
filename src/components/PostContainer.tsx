import Post from './Post';
import CommunityList from './CommunityList';
import SubSchema from '../schemas/sub';

type Props = {
    pageType: string,
    subs: SubSchema[],
    setSubs: React.Dispatch<React.SetStateAction<SubSchema[]>>,
}

export default function PostContainer({pageType, subs, setSubs}: Props) {

    const mapPosts = () => {
        const arr = [1, 2, 3];
        return arr.map((a, b) => {
            return <Post key={b} />
        })
    }

    return (
        <div className="post-container" >
            {pageType !== 'list' && mapPosts()}
            {pageType === 'list' 
            && 
            <CommunityList 
                subs={subs}
                setSubs={setSubs}
            />
            }
        </div>
    )
}