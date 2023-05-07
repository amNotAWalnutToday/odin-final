import { useState } from "react";
import SubSchema from "../../schemas/sub";
import Categories from '../../data/categories.json';

type Props = {
    subSettings: SubSchema | undefined,
    updateSubSettings: ((
        icon: string,
        summary: string, 
        categories: string[],
        rules: {rule: string, description: string}[],
        custom: {
            bannerColor: string,
            cardHeaderColor: string,
            pageBackground: string,
        }
    ) => void) | undefined,
}

interface SubValues {
    icon: string,
    summary: string,
    categories: string[],
    rules: {rule: string, description: string}[],
    custom: {
        bannerColor: string, 
        cardHeaderColor: string, 
        pageBackground: string
    }
}

export default function EditSub({subSettings, updateSubSettings}: Props) {
    const [newSubValues, setNewSubValues] = useState<SubValues>({
        icon: subSettings?.icon ?? '',
        summary: subSettings?.summary ?? '',
        categories: subSettings ? [...subSettings.categories] : [],
        rules: subSettings ? [...subSettings.rules] : [],
        custom: {
            bannerColor: subSettings?.custom?.bannerColor ?? '',
            cardHeaderColor: subSettings?.custom?.cardHeaderColor ?? '',
            pageBackground: subSettings?.custom?.pageBackground ?? '',
        }
    });

    const handleCategoryCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const subvalues = {...newSubValues};
        const categoryName = e.target.value.toLowerCase();
        const checkIfChecked = subvalues.categories?.includes(categoryName);
        if(!checkIfChecked) {
            subvalues.categories?.push(categoryName);
        } else {
            const ind = subvalues.categories?.findIndex((c) => c === categoryName);
            subvalues.categories?.splice(ind, 1);
        }
        setNewSubValues(subvalues);
    }

    const handleRuleInput = (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> , 
        isTitle: boolean
    ) => {
        const subvalues = {...newSubValues};
        const ind = Number(e.target.id.split('-')[2]);
        isTitle 
            ? subvalues.rules[ind].rule = e.target.value
            : subvalues.rules[ind].description = e.target.value;
        setNewSubValues(subvalues);
    }

    const mapCategoriesAsInputs = () => {
        return Categories.map((category, ind) => {
            return(
                <div key={ind} className="post">
                    <label
                        className="text-trivial" 
                        htmlFor={`category_${category.group}`}
                    >
                        {category.group}
                    </label>
                    <input
                        id={`category_${category.group}`}
                        type="checkbox"
                        value={`${category.group}`}
                        onChange={handleCategoryCheck}
                        checked={newSubValues.categories.includes(category.group.toLowerCase())}
                    />
                </div>
            )
        })
    }

    const mapRulesAsInputs = () => {
        return newSubValues.rules.map((rule, ind) => {
            return(
                <li key={ind} className="heavy-border list rules">
                    <div>
                        <label htmlFor={`rule-r-${ind}`}>{ind + 1}. Rule Title</label>
                        <input 
                            id={`rule-r-${ind}`}
                            className="border"
                            type="text" 
                            placeholder="Summarise rule.."
                            onChange={(e) => handleRuleInput(e, true)}
                            value={newSubValues.rules[ind].rule}
                        />
                    </div>
                    <div>
                        <label htmlFor={`rule-d-${ind}`}>{ind + 1}. Description</label>
                        <textarea
                            id={`rule-d-${ind}`}
                            className="border"
                            placeholder="Explain the rule in full.."
                            onChange={(e) => handleRuleInput(e, false)}
                            value={newSubValues.rules[ind].description}
                        />
                    </div>
                    <button 
                        className="btn flair"
                        style={{alignSelf: 'flex-end'}}
                        onClick={() => {
                            const subvalues = {...newSubValues}
                            subvalues.rules.splice(ind, 1);
                            setNewSubValues(subvalues);
                        }}
                    >
                        Remove
                    </button>
                </li>
            )
        });
    }

    return(
        <div className="card body" >
            <hr />
            <div>
                <label htmlFor="sub-icon-input">Sub Icon Image Link</label>
                <input
                    id="sub-icon-input"
                    className="border" 
                    type="text" 
                    placeholder="e.g. link from imgur"
                    onChange={(e) => {
                        const subvalues = {...newSubValues};
                        subvalues.icon = e.target.value;
                        setNewSubValues(subvalues);
                    }}
                    value={newSubValues.icon}
                />
            </div>
            <div className="card" style={{overflow: 'visible'}} >
                <label htmlFor="sub-summary">Summary</label>
                <textarea
                    id="sub-summary"
                    className="border"
                    placeholder="Enter a description about the sub.."
                    onChange={(e) => {
                        const subvalues = {...newSubValues};
                        subvalues.summary = e.target.value;
                        setNewSubValues(subvalues);
                    }}
                    value={newSubValues.summary}
                />
            </div>
            <hr />
            <div>
                <label>Categories</label>
                {mapCategoriesAsInputs()}
            </div>
            <hr />
            <div>
                <ul className="list rules" >
                    {mapRulesAsInputs()}
                    <button 
                        className="btn flair" 
                        onClick={() => {
                            const subvalues = {...newSubValues}
                            subvalues.rules.push({rule: '', description: ''});
                            setNewSubValues(subvalues);
                        }}
                    >
                        Add Rule   
                    </button>
                </ul>
            </div>
            <hr />
            <div className="line-flex" style={{justifyContent: 'space-between'}}>
                <label htmlFor="sub-banner-color">Banner Colour</label>
                <input 
                    id='sub-banner-color'
                    type="color" 
                    onChange={(e) => {
                        const subvalues = {...newSubValues};
                        subvalues.custom.bannerColor = e.target.value;
                        setNewSubValues(subvalues);
                    }}
                    value={newSubValues.custom.bannerColor}
                />
            </div>
            <div className="line-flex" style={{justifyContent: 'space-between'}} >
                <label htmlFor="sub-card-header-color">Card Header Colour</label>
                <input 
                    id="sub-card-header-color"
                    type="color" 
                    onChange={(e) => {
                        const subvalues = {...newSubValues};
                        subvalues.custom.cardHeaderColor = e.target.value;
                        setNewSubValues(subvalues);
                    }}
                    value={newSubValues.custom.cardHeaderColor}
                />
            </div>
            <div>
                <label htmlFor="sub-page-background">Page Background Image Link</label>
                <input
                    id="sub-page-background"
                    className="border" 
                    type="text" 
                    placeholder="e.g. link from imgur"
                    onChange={(e) => {
                        const subvalues = {...newSubValues};
                        subvalues.custom.pageBackground = e.target.value;
                        setNewSubValues(subvalues);
                    }}
                    value={newSubValues.custom.pageBackground}
                />
            </div>
            <button
                className="btn orange-bg"
                onClick={() => {
                    (newSubValues && updateSubSettings) 
                        && 
                        updateSubSettings(
                            newSubValues.icon,
                            newSubValues.summary, 
                            newSubValues.categories, 
                            newSubValues.rules,
                            newSubValues.custom
                        )
                }}
            >
                Confirm Update
            </button>
        </div>
    )
}
