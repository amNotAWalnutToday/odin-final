import { useState } from "react"

type Props = {
    title: string,
    description: string,
    numInList: number | undefined
}

export default function Details({title, description, numInList}: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const toggleOpen = () => setOpen(!open);

    return(
        <li className="details" onClick={toggleOpen}>
            {numInList + '.' ?? ''} {title}
            {open && <span style={{fontSize: '0.9em'}} >{description}</span>}
            <hr />
        </li>
    )
}
