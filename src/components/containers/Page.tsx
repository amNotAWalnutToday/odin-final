import { getDocs, query, collection, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../RouteSwitch';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostContainer from './PostContainer';
import GroupSidebar from './GroupSidebar';
import SubHeader from './SubHeader';
import ComposePost from './ComposePost';
import SubSchema from '../../schemas/sub';
import UserSchema from '../../schemas/user';

type Props = {
    pageType: string,
    user: UserSchema | undefined,
    toggleShowCreateSub: () => void,
    toggleLoginForm: () => void,
}

export default function Page({
        pageType, 
        user, 
        toggleShowCreateSub,
        toggleLoginForm,
    }: Props) {
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
        let subData;
        snapshot.forEach((s) => {
            subData = {
                _id: s.id,
                ...s.data()
            };
        });
        setSubSettings(subData);
    }

    const checkHasJoinedSub = (subSlice: SubSchema) => {
        let hasJoined = false;
        for(const member of subSlice.members) {
            if(member === user?.uid) hasJoined = true;
        }
        return hasJoined;
    }

    const joinSub = async () => {
        try {
            if(!user || !subSettings) throw Error;
            const subSlice = {...subSettings};
            const hasJoined = checkHasJoinedSub(subSlice);
            if(!hasJoined) {
                subSlice.members?.push(user.uid);
            } else {
                const ind = subSlice.members?.findIndex((m) => m === user.uid);
                subSlice.members?.splice(ind, 1);
            }
            await updateDoc(doc(db, 'subs', subSettings._id), subSlice);
            setSubSettings(subSlice);
        } catch(err) {
            console.error(err);
        }
    }

    const updateSubSettings = async (
        icon: string,
        summary: string, 
        categories: string[],
        rules: {rule: string, description: string}[],
        custom: {bannerColor: string, cardHeaderColor: string, pageBackground: string}
    ) => {
        try {
            if(!user || !subSettings) throw Error;
            const subSlice = {...subSettings}
            const updatedSub = {
                ...subSlice,
                icon,
                summary,
                categories,
                rules,
                custom
            }
            await updateDoc(doc(db, 'subs', subSettings._id), updatedSub);
            setSubSettings(updatedSub);
        } catch(err) {
            console.error(err);
        }
    }

    return(
        <main 
            className={`page ${subSettings ? 'custom' : ''}`} 
            style={
                subSettings?.custom?.pageBackground 
                ? 
                {background: `url(${subSettings?.custom?.pageBackground})`}
                : 
                {}
            } 
        >
            {pageType === 'sub' 
            && 
            <SubHeader 
                subSettings={subSettings}
                checkHasJoinedSub={checkHasJoinedSub}
                joinSub={joinSub}
            />
            }
            <div className='content' >
                {pageType === 'submit'
                ? 
                <ComposePost 
                    pageType={pageType}
                    user={user}
                    postForComments={undefined}
                    setPosts={undefined}
                    subSettings={subSettings}
                    checkHasJoinedSub={checkHasJoinedSub}
                    commentUrl={undefined}
                    setIsPosting={undefined}
                    toggleLoginForm={toggleLoginForm}
                />
                :
                <PostContainer 
                    pageType={pageType}
                    user={user}
                    subSettings={subSettings}
                    subs={subs}
                    setSubs={setSubs}
                    joinSub={joinSub}
                    checkHasJoinedSub={checkHasJoinedSub}
                    toggleLoginForm={toggleLoginForm}
                />
                }
                <GroupSidebar 
                    pageType={pageType}
                    user={user}
                    subSettings={subSettings}
                    updateSubSettings={updateSubSettings}
                    toggleShowCreateSub={toggleShowCreateSub}
                />
            </div>
        </main>
    )
}
