import React, { useContext, useEffect, useState } from "react";
import { server_url } from "./servirce";
import { UserContext } from "./userContext";

/**
 *  排行榜紀錄列
 * @returns {React.JSX.Element} RecordComponent
 */
export default function RecordComponent({ item, number }) {
  const { user } = useContext(UserContext);

  const [recipientUser, setRecipientUser] = useState(null);
  useEffect(() => {
    const fetchRecipientUser = async (recipinetPlayerId) => {
      if (!recipinetPlayerId) return;

      try {
        const res = await fetch(
          `${server_url}/user/id?id=${recipinetPlayerId}`,
          {
            method: "get",
            headers: { "Content-Type": "Application/json" },
          }
        );

        const data = await res.json();
        if (data) {
          setRecipientUser(data);
        }
      } catch (error) {}
    };
    fetchRecipientUser(item.id);
  }, []);
  return (
    <>
      {recipientUser && (
        <tr className={recipientUser.id === user?.id && "onrecord"}>
          <td>{number + 1}</td>
          <td>{recipientUser?.name}</td>
          <td>{item.count}</td>
        </tr>
      )}
    </>
  );
}
