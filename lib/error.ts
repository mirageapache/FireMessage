/** auth 錯誤處理 */
export const authErrorHandle = (code: string) => {
  let errorMsg = "";

  switch (code) {
    case "auth/email-already-in-use":
      errorMsg = "Email已存在";
      break;
    case "auth/invalid-credential":
      errorMsg = "Email不存在或密碼錯誤";
      break;
    case "auth/popup-closed-by-user": // 第三方登入狀況下，使用者關閉視窗(此狀況不需做後續處理)
      errorMsg = "";
      break;
    default:
      errorMsg = "註冊失敗";
      break;
  }

  return errorMsg;
};
