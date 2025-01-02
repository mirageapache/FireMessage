import { User } from "firebase/auth";

export type authResponse =
| { code: "SUCCESS"; data: User }
| { code: "ERROR"; error: { code: string; message: string } };
