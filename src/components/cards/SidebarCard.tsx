import { Timestamp } from 'firebase/firestore';
import { useContext, useState } from 'react';
import Details from "../other/Details";
import EditSub from '../other/EditSub';
import RulesCard from './RulesCard';
import { UserContext } from '../../RouteSwitch';
import SubSchema from "../../schemas/sub";

type Props = {
    subSettings: SubSchema | undefined,
    updateSubSettings: ((
        icon: string,
        summary: string, 
        categories: string[],
        rules: {rule: string, description: string}[],
        custom: {
            bannerColor: string,
            cardHeaderColor: string,
            pageBackground: string,
        }
    ) => void) | undefined, 
    type: string,
}

export default function SidebarCard({subSettings, updateSubSettings, type}: Props) {
    const { user } = useContext(UserContext);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const toggleCanEdit = () => setCanEdit(!canEdit);

    const convertTime = (timestamp: Timestamp | undefined) => {
        const date = timestamp?.toDate().toDateString().split(' ');
        date?.shift();
        return date?.join(' ');
    }

    const mapCategories = () => {
        return subSettings?.categories.map((category, ind) => {
            return(
                <button key={ind} className="btn flair" >{category}</button>
            )
        });
    }

    return type === 'about' ? (
        <div className="card border">
            <div 
                className="header card "
                style={{backgroundColor: `${subSettings?.custom?.cardHeaderColor}`}}
            >
                <h4 className="text-imp" >About Community</h4>
            </div>
            <div className="card body">
                {subSettings?.summary}
                <p className='text-trivial' >Created {convertTime(subSettings?.timestamp)}</p>
                <p>r/{subSettings?.name.replace(' ', '')} topics</p>
                {mapCategories()}
                <hr />
                <div style={{display: 'flex'}} >
                    <div>
                        <p>{subSettings?.members?.length ?? 0}</p>
                        <p className="text-trivial">Members</p>
                    </div>
                    <div style={{marginLeft: '25%'}} >
                        <p>0</p>
                        <p className="text-trivial">Online</p>
                    </div>
                </div>
                {(user && user?.uid === subSettings?.creator)
                && 
                <div className='card body' style={{padding: '2px'}} >
                    <hr />
                    <button 
                        className='btn btn-input-bg'
                        onClick={toggleCanEdit}
                    >
                        Edit Sub
                    </button>    
                    {canEdit
                    &&
                    <EditSub
                        subSettings={subSettings}
                        updateSubSettings={updateSubSettings}
                    />
                    }
                </div>
                }
            </div>
        </div>
    ) 
    : type === 'rules' && subSettings?.rules
        ? 
        <RulesCard 
            headerSettings={
                {
                    color: subSettings?.custom?.cardHeaderColor, 
                    title: `r/${subSettings?.name.replace(" ", "")} Rules`
                }
            }
            rules={subSettings?.rules}
        />
        : <div></div>
}
