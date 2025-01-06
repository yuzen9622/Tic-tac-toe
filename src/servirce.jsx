/**
 * @fileoverview 本地伺服器地址和雲端伺服器地址管理
 * @module service 伺服器地址管理
 * @module service checkUser查看用戶權限
 */

//export const url = "http://localhost:5000";
//export const server_url = "http://localhost:8080/api/v1";
export const AI_server_url = "http://localhost:5000";
export const server_url = "https://tic-tac-toe-java-server.onrender.com/api/v1";
export const url = "https://tic-tac-toe-socket-server.onrender.com";
//export const AI_server_url = "https://ai-server-0dmx.onrender.com";

/**
 * 檢查用戶權限
 * @returns {Promise<boolean>} 是否有權限
 */
export const checkUser = async () => {
  const user_info = JSON.parse(sessionStorage.getItem("player_info"));
  if (!user_info) return true;
  try {
    const res = await fetch(`${server_url}/user/id?id=${user_info?.id}`);
    console.log("check");
    if (res.status === 200) {
      const data = await res.json();

      if (
        data?.id !== user_info?.id ||
        data?.name !== user_info?.name ||
        data?.email !== user_info?.email
      ) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
