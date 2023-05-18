import Details from "../other/Details"
import { Rule } from "../../schemas/sub"

interface HeaderSettings {
    color: string,
    title: string,
}

type Props = {
    headerSettings: HeaderSettings,
    rules: Rule[],
}

export default function RulesCard({headerSettings, rules}: Props) {
    const mapRules = () => {
        return rules.map((rule, ind) => {
            return(
                <Details
                    title={rule.rule}
                    description={rule.description}
                    numInList={ind + 1}
                    key={ind}
                />
            )
        });
    }
    return(
        <div className="card border">
            <div
                className="header card"
                style={{backgroundColor: `${headerSettings.color}`}}
            >
                <h4 className="text-imp">
                    {headerSettings.title}
                </h4>
            </div>
            <ul className="card body">
                {mapRules()}
            </ul>
        </div>
    )
}