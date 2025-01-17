import { User } from "firebase/auth";

/** response type of firebase auth */
export type authResponseType =
| { code: "SUCCESS"; data: User }
| { code: "ERROR"; error: { code: string; message: string } };
