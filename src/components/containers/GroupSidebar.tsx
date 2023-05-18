import SidebarCard from "../cards/SidebarCard"
import RulesCard from "../cards/RulesCard";
import HomeSidebarCard from "../cards/HomeSidebarCard";
import PolicySidebarCard from "../cards/PolicySidebarCard";
import ProfileSidebarCard from "../cards/ProfileSidebarCard";
import SubSchema from "../../schemas/sub"
import UserSchema from "../../schemas/user";
import postingRules from '../../data/postingRules.json';

type Props = {
    pageType: string,
    user: UserSchema | undefined,
    subSettings: SubSchema | undefined, 
    updateSubSettings: (
        icon: string,
        summary: string, 
        categories: string[],
        rules: {rule: string, description: string}[],
        custom: {
            bannerColor: string,
            cardHeaderColor: string,
            pageBackground: string,
        }
    ) => void,
    toggleShowCreateSub: () => void,
}

export default function GroupSidebar({
        pageType, 
        user, 
        subSettings, 
        updateSubSettings,
        toggleShowCreateSub
    }: Props) {
    return(
        <div className="sidebar sub" >
            {(pageType === 'home' && user)
            &&
            <HomeSidebarCard 
                toggleShowCreateSub={toggleShowCreateSub}
            />
            }
            {pageType === 'home'
            &&
            <PolicySidebarCard />
            }

            {pageType === 'user'
            &&
            <ProfileSidebarCard 
                pageType={pageType}
            />
            }

            {subSettings 
            && 
            <SidebarCard 
                subSettings={subSettings}
                updateSubSettings={updateSubSettings}
                type={'about'}
            />
            }
            {(subSettings && subSettings.rules?.length > 0)
            &&
            <SidebarCard
                subSettings={subSettings}
                updateSubSettings={undefined}
                type={'rules'}
            />
            }
            {pageType === 'submit'
            &&
            <RulesCard 
                headerSettings={
                    {
                        color: '',
                        title: 'Posting to Replicatedit'
                    }
                }
                rules={postingRules}
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