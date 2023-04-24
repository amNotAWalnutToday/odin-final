export default function PolicySidebarCard() {
    return(
        <div className="card border" >
            <div className="card body" >
                <ul className="list" >
                    <div className="card body" >
                        <li className="text-trivial" >User Agreement</li>
                        <li className="text-trivial" >Content Policy</li>
                    </div>
                    <div className="card body" >
                        <li className="text-trivial" >Privacy Policy</li>
                        <li className="text-trivial" >Moderator Code Of Conduct</li>
                    </div>
                </ul>
                <hr />
                <ul className="list" >
                    <div className="card body" >
                        <li className="text-trivial" >English</li>
                        <li className="text-trivial" >Deutsch</li>
                        <li className="text-trivial" >Francais</li>
                    </div>
                    <div className="card body">
                        <li className="text-trivial" >Espanol</li>
                        <li className="text-trivial" >Italiano</li>
                        <li className="text-trivial" >Portugues</li>
                    </div>
                </ul>
                <hr />
                <p 
                    style={{fontSize: '0.75em'}}
                    className="text-trivial" 
                >
                    Replicated Inc C 2023. No right reserved
                </p>
            </div>
        </div>
    )
}
