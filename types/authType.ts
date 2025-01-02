export type authResponse =
| { code: "SUCCESS"; message: string }
| { code: "ERROR"; error: { code: string; message: string } };
