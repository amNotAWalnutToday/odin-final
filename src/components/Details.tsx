import { useState } from "react"

export default function Details() {
    const [open, setOpen] = useState<boolean>(false);
    const toggleOpen = () => setOpen(!open);

    return(
        <li className="details" onClick={toggleOpen}>
            No unproffesional or derogatory speech
            {open && <span style={{fontSize: '0.9em'}} >Follow reddiquette: behave professionally and civilly at all times. Communicate to others the same way you would at your workplace. Disagreement and technical critiques are ok, but personal attacks are not.

Abusive, racist, or derogatory comments are absolutely not tolerated.

See our policies on acceptable speech and conduct for more details.

Violations cause instant ban.</span>}
            <hr />
        </li>
    )
}
