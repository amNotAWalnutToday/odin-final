import PostContainer from './PostContainer';
import GroupSidebar from './GroupSidebar';
import SubHeader from './SubHeader';

type Props = {
    pageType: string,
}

export default function Page({pageType}: Props) {
    return(
        <main className="page" >
            {pageType === 'sub' && <SubHeader />}
            <div className='content' >
                <PostContainer />
                <GroupSidebar />
            </div>
        </main>
    )
}