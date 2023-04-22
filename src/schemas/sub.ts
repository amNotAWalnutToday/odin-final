import { Timestamp } from "firebase/firestore";

type SubSchema = {
    name: string,
    summary: string,
    icon: string,
    categories: string[],
    rules: {rule: string, description: string}[],
    timestamp: Timestamp,
    creator: string,
}

export default SubSchema;
