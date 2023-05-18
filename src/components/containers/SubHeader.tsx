import { 
    doc, 
    deleteDoc, 
    writeBatch, 
    collection, 
    query,
    where, 
    getDocs 
} from "firebase/firestore"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { db, UserContext } from "../../RouteSwitch"
import SubSchema from "../../schemas/sub"

type Props = {
    subSettings: SubSchema | undefined, 
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
    joinSub: () => void,
}

export default function SubHeader({subSettings, checkHasJoinedSub, joinSub}: Props) {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    
    const disbandSub = async () => {
        try {
            if(!subSettings || !user || user.email !== subSettings.creator) return;
            await deleteDoc(doc(db, 'subs', subSettings?._id));
            const postBatch = writeBatch(db);
            const postQuery = query(
                collection(db, "posts"),
                where("parent", "==", subSettings?.name),
            );
            const subPosts = await getDocs(postQuery);
            subPosts.forEach((subPost) => {
                postBatch.delete(subPost.ref)
            });
            await postBatch.commit();
            navigate('/');
        } catch(err) {
            console.error(err);
        }
    }

    return(
        <>
            <div 
                className="banner" 
                style={{backgroundColor: subSettings?.custom?.bannerColor ?? 'var(--icon-blue)'}}
            />
            <div className="header sub" style={{flexDirection: 'column'}} >
                <div style={{alignSelf: 'flex-start', marginLeft: '18rem'}} >
                    <div className="line-flex" style={{gap: '3rem'}} >
                        <div className="line-flex" >
                            {!subSettings?.icon
                                ? <div className="default-icon icon-big"/>
                                :
                                <img
                                    className="default-icon icon-big"
                                    src={`${subSettings?.icon}`}
                                    alt=""
                                    onError={() => <div className="default-icon icon-big"/>}
                                />
                            }
                            <h2>{subSettings?.name}</h2>
                        </div>
                        {subSettings && !checkHasJoinedSub(subSettings)
                        ?
                        <button
                            className="btn"
                            onClick={joinSub}
                        >
                            Join
                        </button>
                        :
                        subSettings?.creator === user?.email
                        ?
                        <button  
                            className="btn crimson-bg"
                            onClick={disbandSub}
                        >
                            Disband
                        </button>
                        :
                        <button
                            className="btn btn-input-bg"
                            onClick={joinSub}
                        >
                            Joined
                        </button>

                        }
                    </div>
                    <p className="text-trivial">r/{subSettings?.name.replace(' ', '')}</p>
                </div>
            </div>
        </>
    )
}
