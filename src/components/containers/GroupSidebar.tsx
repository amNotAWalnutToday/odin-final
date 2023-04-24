import SidebarCard from "../cards/SidebarCard"
import SubSchema from "../../schemas/sub"

type Props = {
    subSettings: SubSchema | undefined; 
}

export default function GroupSidebar({subSettings}: Props) {
    return(
        <div className="sidebar sub" >
            {subSettings && 
            <SidebarCard 
                subSettings={subSettings}
                type={'about'}
            />
            }
            {subSettings &&
            <SidebarCard
                subSettings={subSettings}
                type={'rules'}
            />
            }
            <button 
                className='scroll-btn btn flair' 
                onClick={() => {
                    window.scrollTo(0, 0);
                }}
            >
                Back To Top
            </button>
        </div>
    )
}