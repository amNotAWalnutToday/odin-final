import PostContainer from './PostContainer';
import GroupSidebar from './GroupSidebar';
import SubHeader from './SubHeader';

export default function Page() {
    return(
        <main className="page" >
            <SubHeader />
            <div style={{display: 'flex', gap: '1.75rem'}} >
                <PostContainer />
                <GroupSidebar />
            </div>
        </main>
    )
}