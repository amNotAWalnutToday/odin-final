import SubSchema from "../../schemas/sub"

type Props = {
    subSettings: SubSchema | undefined, 
    checkHasJoinedSub: (subSlice: SubSchema) => boolean,
    joinSub: () => void,
}

export default function SubHeader({subSettings, checkHasJoinedSub, joinSub}: Props) {
    return(
        <div className="header sub" style={{flexDirection: 'column'}} >
            <div style={{alignSelf: 'flex-start', marginLeft: '8rem'}} >
                <div className="line-flex" style={{gap: '3rem'}} >
                    <h2>{subSettings?.name}</h2>
                    {subSettings && !checkHasJoinedSub(subSettings)
                    ? 
                    <button
                        className="btn"
                        onClick={joinSub}
                    >
                        Join
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
            <nav>
                <button>Posts</button>
            </nav>
        </div>
    )
}
