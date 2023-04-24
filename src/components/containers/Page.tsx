import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../../RouteSwitch';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostContainer from './PostContainer';
import GroupSidebar from './GroupSidebar';
import SubHeader from './SubHeader';
import ComposePost from './ComposePost';
import SubSchema from '../../schemas/sub';

type Props = {
    pageType: string,
}

export default function Page({pageType}: Props) {
    const { sub } = useParams();
    const [subs, setSubs] = useState<SubSchema[]>([]);
    const [subSettings, setSubSettings] = useState<SubSchema>();

    useEffect(() => {
        getSub();
        /* eslint-disable-next-line*/
    }, [sub]);

    const getSub = async () => {
        if(!sub) return setSubSettings(undefined);
        const subQuery = query(
            collection(db, 'subs'),
            where('name', '==', sub)
        );
        const snapshot = await getDocs(subQuery);
        let data;
        snapshot.forEach((s) => {
            data = s.data();
        })
        setSubSettings(data);
    }

    return(
        <main className="page" >
            {pageType === 'sub' 
            && 
            <SubHeader 
                subSettings={subSettings}
            />
            }
            <div className='content' >
                {pageType === 'submit'
                ? 
                <ComposePost 
                
                />
                :
                <PostContainer 
                    pageType={pageType}
                    subSettings={subSettings}
                    subs={subs}
                    setSubs={setSubs}
                />
                }
                <GroupSidebar 
                    subSettings={subSettings}
                />
            </div>
        </main>
    )
}
