import SubSchema from "../schemas/sub"

type Props = {
    subSettings: SubSchema | undefined, 
}

export default function SubHeader({subSettings}: Props) {
    return(
        <div className="header sub" style={{flexDirection: 'column'}} >
            <h2>{subSettings?.name}</h2>
            <nav>
                <button>Posts</button>
            </nav>
        </div>
    )
}
