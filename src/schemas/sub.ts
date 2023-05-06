import { Timestamp } from "firebase/firestore";

type SubSchema = {
    _id: string,
    name: string,
    summary: string,
    icon: string,
    categories: string[],
    rules: {rule: string, description: string}[],
    timestamp: Timestamp,
    members: string[],
    creator: string,
}

export default SubSchema;
