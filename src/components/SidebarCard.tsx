import Details from "./Details";
import SubSchema from "../schemas/sub"

type Props = {
    subSettings: SubSchema | undefined, 
    type: string,
}

export default function SidebarCard({subSettings, type}: Props) {

    const mapCategories = () => {
        return subSettings?.categories.map((category, ind) => {
            return(
                <button key={ind} className="btn flair" >{category}</button>
            )
        });
    }

    return type === 'about' ? (
        <div className="card border">
            <div className="header card " >
                <h4 className="text-imp" >About Community</h4>
            </div>
            <div className="card body" >
                {subSettings?.summary}
                <p>r/{subSettings?.name.replace(' ', '')} topics</p>
                {mapCategories()}
                <hr />
                <div style={{display: 'flex'}} >
                    <div>
                        <p>0</p>
                        <p className="text-trivial">Members</p>
                    </div>
                    <div style={{marginLeft: '25%'}} >
                        <p>0</p>
                        <p className="text-trivial">Online</p>
                    </div>
                </div>
            </div>
        </div>
    ) 
    : type === 'rules' 
        ? 
        <div className="card border">
            <div className="header card">
                <h4 className="text-imp" >r/{subSettings?.name.replace(' ', '')} Rules</h4>
            </div>
            <ul className="card body">
                <Details />
            </ul>
        </div>
        : <div></div>
}
