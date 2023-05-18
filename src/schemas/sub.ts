import { Timestamp } from "firebase/firestore";

export interface Rule {
    rule: string,
    description: string,
}

interface SubCustom {
    bannerColor: string,
    cardHeaderColor: string,
    pageBackground: string,
}

type SubSchema = {
    _id: string,
    name: string,
    summary: string,
    icon: string,
    custom: SubCustom,
    categories: string[],
    rules: Rule[],
    timestamp: Timestamp,
    members: string[],
    creator: string,
}

export default SubSchema;
