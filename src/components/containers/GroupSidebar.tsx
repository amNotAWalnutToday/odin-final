import SidebarCard from "../cards/SidebarCard"
import HomeSidebarCard from "../cards/HomeSidebarCard";
import PolicySidebarCard from "../cards/PolicySidebarCard";
import SubSchema from "../../schemas/sub"

type Props = {
    pageType: string,
    subSettings: SubSchema | undefined; 
}

export default function GroupSidebar({pageType, subSettings}: Props) {
    return(
        <div className="sidebar sub" >
            {pageType === 'home'
            &&
            <HomeSidebarCard />
            }
            {pageType === 'home'
            &&
            <PolicySidebarCard/>
            }

            {subSettings 
            && 
            <SidebarCard 
                subSettings={subSettings}
                type={'about'}
            />
            }
            {subSettings 
            &&
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