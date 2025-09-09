import React from "react";
import "./style.css";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// Random ID generator
function randomID(len) {
  let result = "";
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  const maxPos = chars.length;
  len = len || 5;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

// Get token from server
function generateToken(tokenServerUrl, appID, userID) {
  return fetch(tokenServerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_id: appID,
      user_id: userID,
    }),
  }).then(async (res) => {
    const result = await res.text();
    return result;
  });
}

// Get URL params
export function getUrlParams(url = window.location.href) {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function App() {
  const roomID = getUrlParams().get("roomID") || randomID(5);
  const userID = randomID(5);
  const userName = "User_" + randomID(3);

  const myMeeting = async (element) => {
    if (!element) return;

    // Generate token
    const token = await generateToken(
      "https://mini-game-test-server.zego.im/api/token", // replace with your own token server
      2013980891, // replace with your AppID
      userID
    );

    // Create Kit Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      2013980891, // AppID
      token, // Token
      roomID, // RoomID
      userID, // UserID
      userName // UserName
    );

    // Create instance
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Join room
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.origin +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // or ZegoUIKitPrebuilt.OneONoneCall
      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
const appID = import.meta.env.VITE_ZEGO_APP_ID;
const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
