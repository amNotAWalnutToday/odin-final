import { Timestamp } from "firebase/firestore";

type UserSchema = {
    uid: string | null,
    email: string,
    name: string,
    timestamp: Timestamp,
}

export default UserSchema;
