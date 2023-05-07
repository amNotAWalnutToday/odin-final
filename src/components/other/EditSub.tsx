import { useState } from "react";
import SubSchema from "../../schemas/sub";
import Categories from '../../data/categories.json';

type Props = {
    subSettings: SubSchema | undefined,
    updateSubSettings: ((
        summary: string, 
        categories: string[],
        rules: {rule: string, description: string}[]
    ) => void) | undefined,
}

interface SubValues {
    summary: string,
    categories: string[],
    rules: {rule: string, description: string}[]
}

export default function EditSub({subSettings, updateSubSettings}: Props) {
    const [newSubValues, setNewSubValues] = useState<SubValues>({
        summary: subSettings?.summary ?? '',
        categories: subSettings ? [...subSettings.categories] : [],
        rules: subSettings ? [...subSettings.rules] : [],
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
                    >{category.group}</label>
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
                        <label htmlFor="">{ind + 1}. Title</label>
                        <input 
                            id={`rule-r-${ind}`}
                            className="border"
                            type="text" 
                            onChange={(e) => handleRuleInput(e, true)}
                            value={newSubValues.rules[ind].rule}
                        />
                    </div>
                    <div>
                        <label htmlFor="">{ind + 1}. Description</label>
                        <textarea
                            id={`rule-d-${ind}`}
                            className="border"
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
            <div className="card" style={{overflow: 'visible'}} >
                <label htmlFor="sub-summary">Summary</label>
                <textarea
                    id="sub-summary"
                    className="border"
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
            <button
                className="btn orange-bg"
                onClick={() => (newSubValues && updateSubSettings) && updateSubSettings(newSubValues.summary, newSubValues.categories, newSubValues.rules)}
            >
                Confirm Update
            </button>
        </div>
    )
}
