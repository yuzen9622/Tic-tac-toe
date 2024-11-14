export const url = "https://tic-tac-toe-socket-server.onrender.com";
//export const url = "http://localhost:5000";
//export const server_url = "http://localhost:8080/api/v1";
export const server_url = "https://tic-tac-toe-java-server.onrender.com/api/v1";
export const handleLocationChange = () => {
  // 檢查是否切換到 online 頁面，並且確認是否已經重載過
  if (sessionStorage.getItem("hasReloaded") === "false") {
    console.log("即將切換到 online 頁面，先刷新一次");
    sessionStorage.setItem("hasReloaded", "true"); // 設置已重載標記
    window.location.reload(); // 重新加載頁面
  }
};

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
