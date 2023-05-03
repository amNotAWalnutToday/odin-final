import SidebarCard from "../cards/SidebarCard"
import HomeSidebarCard from "../cards/HomeSidebarCard";
import PolicySidebarCard from "../cards/PolicySidebarCard";
import SubSchema from "../../schemas/sub"
import UserSchema from "../../schemas/user";

type Props = {
    pageType: string,
    user: UserSchema | undefined,
    subSettings: SubSchema | undefined; 
}

export default function GroupSidebar({pageType, user, subSettings}: Props) {
    return(
        <div className="sidebar sub" >
            {(pageType === 'home' && user)
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