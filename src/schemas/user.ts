import { Timestamp } from "firebase/firestore";

type UserSchema = {
    uid: string,
    name: string,
    timestamp: Timestamp,
}

export default UserSchema;
