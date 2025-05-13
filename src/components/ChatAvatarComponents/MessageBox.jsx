// import { useCallback, useRef } from "react";
// import { BsStars } from "react-icons/bs";
// import { GrAttachment } from "react-icons/gr";
// import { MdOutlineMicNone } from "react-icons/md";
// import { IoMdArrowUp } from "react-icons/io";

// const MessageBox = ({
//   sessionActive,
//   imgUrl,
//   setImgUrl,
//   handleUserQuery,
//   useLocalVideoForIdle,
//   showSubtitles,
//   chatHistory,
//   assistantMessages,
//   startSession,
//   toggleMicrophone,
//   stopSpeaking,
//   clearChatHistory,
//   stopSession,
//   microphoneText,
//   isSpeaking,
// }) => {
//   const textareaRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const handleKeyUp = useCallback(
//     (e) => {
//       if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         const userQuery = textareaRef.current.value.trim();
//         if (userQuery) {
//           const userQueryHTML = imgUrl
//             ? `<br/><img src="${imgUrl}" style="width:200px;height:200px"/><br/>${userQuery}`
//             : userQuery;
//           handleUserQuery(userQuery, userQueryHTML, imgUrl);
//           textareaRef.current.value = "";
//           setImgUrl("");
//         }
//       }
//     },
//     [handleUserQuery, imgUrl, setImgUrl]
//   );

//   const handleAttachClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       // For demo purposes, use a fixed image URL.
//       const newImgUrl = "https://wallpaperaccess.com/full/528436.jpg";
//       setImgUrl(newImgUrl);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto flex flex-col p-4 bg-transparent">
//       {/* Assistant messages and videos */}
// <div className="flex justify-end mb-4 space-x-4">
//   <div
//     className="h-[400px] overflow-y-auto p-2 rounded-lg"
//     style={{ scrollbarWidth: "thin" }}
//   >
//     <div
//       id="assistantMessages"
//       dangerouslySetInnerHTML={{ __html: assistantMessages }}
//     />
//   </div>
//   <div className="flex items-end relative z-10">
//     {useLocalVideoForIdle && !sessionActive && (
//       <div id="localVideo">
//         <video
//           src="/video/lisa-casual-sitting-idle.mp4"
//           autoPlay
//           loop
//           muted
//         />
//       </div>
//     )}
//     <div
//       id="remoteVideo"
//       className="w-[320px] h-[180px]"
//       style={{ background: "transparent" }}
//     ></div>
//     <div
//       id="subtitles"
//       className={`w-full text-center text-white text-sm absolute bottom-2 z-50 ${
//         showSubtitles ? "" : "hidden"
//       }`}
//       style={{
//         textShadow:
//           "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
//       }}
//     ></div>
//   </div>
// </div>

//       {/* Additional control buttons */}
//       <div className="mt-4 flex flex-wrap justify-center gap-2 z-50 relative">
//         <button
//           onClick={startSession}
//           disabled={sessionActive && !useLocalVideoForIdle}
//           className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full disabled:opacity-50"
//           title="Start Session"
//         >
//           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M5 3l14 9-14 9V3z" />
//           </svg>
//         </button>

//         <button
//           onClick={stopSpeaking}
//           disabled={!isSpeaking}
//           className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full disabled:opacity-50"
//           title="Stop Speaking"
//         >
//           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M6 6h12v12H6z" />
//           </svg>
//         </button>

//         <button
//           onClick={clearChatHistory}
//           className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
//           title="Clear Chat History"
//         >
//           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
//           </svg>
//         </button>

//         <button
//           onClick={stopSession}
//           disabled={!sessionActive}
//           className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full disabled:opacity-50"
//           title="Stop Session"
//         >
//           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
//           </svg>
//         </button>
//       </div>

//       {/* New Input UI (from ChatFooter) */}
//       <footer className="p-2 sm:p-3 md:p-4 flex justify-center mt-auto w-full">
//         <div className="w-full bg-white border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 shadow-md">
//           <div className="flex items-center space-x-2 mb-2 md:mb-3">
//             <BsStars className="text-2xl sm:text-3xl md:text-4xl" />
//             <textarea
//               ref={textareaRef}
//               onKeyUp={handleKeyUp}
//               placeholder="Ask me anything..."
//               className="flex-1 py-1 px-2 md:px-3 outline-none text-black text-xs sm:text-sm md:text-base resize-none h-[60px]"
//               style={{ scrollbarWidth: "thin" }}
//             />
//           </div>

//           <div className="flex justify-between items-center">
//             <div
//               className="flex items-center border border-gray-300 rounded px-2 py-1 space-x-1 sm:space-x-2 cursor-pointer"
//               onClick={handleAttachClick}
//             >
//               <GrAttachment className="text-2xl" />
//               <span className="text-xs sm:text-sm text-black">Attach</span>
//             </div>
//             <div className="flex items-center space-x-1 sm:space-x-2">
//               <button
//                 onClick={toggleMicrophone}
//                 disabled={!sessionActive}
//                 className="border border-gray-300 rounded p-1 sm:p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
//               >
//                 <MdOutlineMicNone className="text-xl" />
//               </button>
//               <button
//                 onClick={() =>
//                   textareaRef.current?.dispatchEvent(
//                     new KeyboardEvent("keyup", { key: "Enter" })
//                   )
//                 }
//                 className="border border-gray-300 rounded p-1 sm:p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
//               >
//                 <IoMdArrowUp className="text-xl" />
//               </button>
//             </div>
//           </div>

//           {imgUrl && (
//             <div className="mt-2">
//               <img
//                 src={imgUrl}
//                 alt="Uploaded"
//                 className="w-24 h-24 rounded border"
//               />
//             </div>
//           )}
//         </div>
//       </footer>

//       {/* Hidden file input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         onChange={handleFileChange}
//         accept="image/*"
//       />
//     </div>
//   );
// };

// export default MessageBox;

import { useCallback, useRef, useEffect, useState } from "react";
import frame1 from "../../assets/frame1-bg.png";
import frame2 from "../../assets/frame2-bg.png";
import frame3 from "../../assets/frame3-bg.png";
import {
  MdCoPresent,
  MdLiveHelp,
  MdOutlineHandyman,
  MdOutlineSettings,
} from "react-icons/md";
import { TbContract } from "react-icons/tb";

const MessageBox = ({
  sessionActive,
  imgUrl,
  setImgUrl,
  handleUserQuery,
  useLocalVideoForIdle,
  showSubtitles,
  chatHistory,
  assistantMessages,
  startSession,
  toggleMicrophone,
  stopSpeaking,
  clearChatHistory,
  stopSession,
  microphoneText,
  isSpeaking,
  onStartingChange,
  setTextareaRef,
  forwardRefToGrandparent,
}) => {
  const textareaRef = useRef(null);
  const [starting, setStarting] = useState(true);
  const [startingAvatar, setStartingAvatar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [isAvatarReady, setIsAvatarReady] = useState(false);

  // Add this effect near the top of the component
  useEffect(() => {
    const scrollToBottom = (smooth = true) => {
      const chatContainer = document.querySelector(".custom-scrollbar");
      if (chatContainer) {
        const scrollOptions = smooth ? { behavior: "smooth" } : undefined;
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          ...scrollOptions,
        });
      }
    };

    // Scroll on new messages
    if (assistantMessages) {
      scrollToBottom();
    }

    // Scroll when chat history changes
    if (chatHistory?.length) {
      scrollToBottom(false);
    }
  }, [assistantMessages, chatHistory]);
  console.log("Chat HISTORY:", chatHistory);

  const handleStart = () => {
    setStarting(true);
    setStartingAvatar(false);
    setIsLoading(true);
    onStartingChange?.(false);
    startSession();
  };

  useEffect(() => {
    const container = document.getElementById("assistantMessages");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [assistantMessages]);

  useEffect(() => {
    onStartingChange?.(starting);
  }, [starting]);

  useEffect(() => {
    if (textareaRef.current) {
      if (setTextareaRef) {
        setTextareaRef(textareaRef);
      }
      if (forwardRefToGrandparent) {
        forwardRefToGrandparent(textareaRef);
      }
    }
  }, [setTextareaRef, forwardRefToGrandparent]);

  useEffect(() => {
    if (sessionActive && isLoading) {
      setIsLoading(false);
    }
  }, [sessionActive, isLoading]);

  // Reset states on session end
  useEffect(() => {
    if (!sessionActive) {
      setStartingAvatar(true);
      setStarting(true);
      setIsAvatarReady(false);
      setIsLoading(false);
      setShowWelcome(false);
    }
  }, [sessionActive]);

  useEffect(() => {
    if (sessionActive && !assistantMessages && !chatHistory?.length) {
      setShowWelcome(true);
    } else if (assistantMessages || chatHistory?.length) {
      setShowWelcome(false);
    }
  }, [sessionActive, assistantMessages, chatHistory]);

  useEffect(() => {
    if (chatHistory || assistantMessages) {
      console.log("Hiding welcome message due to messages");
      setShowWelcome(false);
    }
  }, [chatHistory, assistantMessages]);

  useEffect(() => {
    console.log("assistantMessages content:", assistantMessages);
    console.log("Chat HISTORY:", chatHistory);
  }, [assistantMessages, chatHistory]);

  console.log("Session Active:", sessionActive, "Is Loading:", isLoading);

  const handleKeyUp = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const userQuery = textareaRef.current.value.trim();
        if (userQuery) {
          const userQueryHTML = imgUrl
            ? `<br/><img src="${imgUrl}" style="width:200px;height:200px"/><br/>${userQuery}`
            : userQuery;
          handleUserQuery(userQuery, userQueryHTML, imgUrl);
          textareaRef.current.value = "";
          setImgUrl("");
          setMessage("");
        }
      }
    },
    [handleUserQuery, imgUrl, setImgUrl]
  );

  const handleImageUpload = useCallback(() => {
    const newImgUrl = "https://wallpaperaccess.com/full/528436.jpg";
    setImgUrl(newImgUrl);
  }, [setImgUrl]);

  const handleOptionSelect = (label) => {
    setMessage(label);
    setIsLoading(true);
    handleStart();
    console.log("Option selected:", label);

    setTimeout(() => {
      console.log("Dispatching Enter key");
      const enterEvent = new KeyboardEvent("keyup", {
        key: "Enter",
        keyCode: 13,
        code: "Enter",
        which: 13,
        bubbles: true,
      });
      document.getElementById("userMessageBox").dispatchEvent(enterEvent);
    }, 10000);
  };

  const handleStartStop = () => {
    if (sessionActive && !useLocalVideoForIdle) {
      stopSession();
      clearChatHistory();
      setStartingAvatar(true);
      setStarting(true);
      setIsAvatarReady(false);
      setIsLoading(false);
      onStartingChange?.(true);
    } else {
      handleStart();
    }
  };

  return (
    <div className="flex flex-col items-center font-johnsonText">
      <style>
        {`
          #remoteVideo, #remoteVideo video {
            background: transparent !important;
          }
          .assistant-content {
            min-height: 20px; /* Ensure container is visible even when empty */
          }
        `}
      </style>
      {startingAvatar && (
        <button
          onClick={handleStart}
          className={`disabled:opacity-50 rounded-full p-2 my-2 w-160 text-white text-bold bg-[#EB1700] hover:bg-[#c91400] h-10 flex items-center justify-center border border-gray-200 cursor-pointer`}
          title={
            sessionActive && !useLocalVideoForIdle
              ? "Stop Training"
              : "Start Training"
          }
        >
          {sessionActive && !useLocalVideoForIdle
            ? "Stop Training"
            : "Initiate"}
        </button>
      )}
      {!startingAvatar && (
        <div className="w-[1500px] mx-auto flex flex-col items-center px-4 min-h-[100px] max-h-[90vh] overflow-auto bg-transparent">
          {isLoading && !startingAvatar && (
            <div className="flex justify-center mb-4 items-center max-w-4xl">
              <div className="animate-spin rounded-full h-16 w-16 mb-4 border-t-4 border-b-4 border-red-600"></div>
            </div>
          )}
          {!startingAvatar && (
            <div className="flex justify-end max-w-4xl max-h-100 w-full">
              <div
                className="overflow-y-auto p-2 rounded-lg"
                style={{
                  scrollbarWidth: "thin",
                  display: sessionActive ? "block" : "none", // Simplify condition
                }}
              >
                <div
                  id="assistantMessages"
                  className="assistant-content"
                  dangerouslySetInnerHTML={{ __html: chatHistory }}
                ></div>
              </div>

              {/* Welcome message - Show below chat when appropriate */}
              {sessionActive && showWelcome && (
                <div className="bg-white rounded-lg mb-8 shadow-sm p-6 transition-opacity duration-300">
                  <h3 className="text-lg font-semibold mb-4">
                    Welcome to Your Onboarding Genie!
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">I can help you with:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Learning about company policies</li>
                      <li>Understanding your role and responsibilities</li>
                      <li>Getting started with tools and resources</li>
                      <li>Training and development opportunities</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      Feel free to ask me anything about your onboarding
                      process!
                    </p>
                  </div>
                </div>
              )}
              <div
                className="flex  translate-y-6 items-end"
                style={{ zIndex: 10, background: "transparent" }}
              >
                <div
                  id="localVideo"
                  className={`${
                    useLocalVideoForIdle && !sessionActive ? "" : "hidden"
                  }`}
                >
                  <video
                    src="/video/lisa-casual-sitting-idle.mp4"
                    autoPlay
                    loop
                    muted
                    style={{
                      width: "450px",
                      height: "300px",
                      zIndex: 5,
                      background: "transparent",
                    }}
                  ></video>
                </div>
                <div
                  id="remoteVideo"
                  style={{
                    width: "450px",
                    height: "300px",
                    zIndex: 10,
                    background: "transparent",
                    display: isLoading || !sessionActive ? "none" : "block",
                  }}
                ></div>
                <div
                  id="subtitles"
                  className={`w-full text-center text-white text-sm absolute bottom-2 z-50 ${
                    showSubtitles ? "" : "hidden"
                  }`}
                  style={{
                    textShadow:
                      "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                    zIndex: 30,
                    display: isLoading || !sessionActive ? "none" : "block",
                    background: "transparent",
                  }}
                ></div>
              </div>
            </div>
          )}
          <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-md p-4 w-full max-w-4xl mx-auto">
            <div className="flex flex-row items-center justify-center">
              <img
                src="/star.svg"
                alt="Star Icon"
                className="w-10 h-16 object-contain"
              />

              <textarea
                id="userMessageBox"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                ref={textareaRef}
                className="w-full min-h-[40px] max-h-[200px] overflow-auto resize-y rounded-xl pt-2 px-4 bg-white text-gray-700 placeholder-gray-400 focus:outline-none text-semibold"
                onKeyUp={handleKeyUp}
                placeholder="Type or speak your message here..."
                style={{ scrollbarWidth: "thin" }}
              ></textarea>
            </div>
            <div className="flex justify-end items-center gap-4 mt-3">
              <div className="flex justify-end">
                <div className="relative group">
                  <button
                    onClick={toggleMicrophone}
                    disabled={!sessionActive}
                    className="disabled:opacity-50 rounded-full w-14 h-14 flex items-center justify-center transition duration-150 cursor-pointer active:scale-95"
                    title={microphoneText}
                  >
                    <img
                      src="/mic.svg"
                      alt="Mic Icon"
                      className="w-10 h-10 p-2 bg-black shadow-md rounded-full transition-transform duration-200 group-hover:scale-110"
                    />
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-sm text-gray-800 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {microphoneText}
                  </div>
                </div>
              </div>
              <button
                onClick={handleStartStop}
                className={`${
                  sessionActive && !useLocalVideoForIdle
                    ? "bg-[#EB1700] hover:bg-[#c91400] text-white"
                    : "bg-transparent text-gray-500"
                } disabled:opacity-50 rounded-full p-2 my-2 w-40 h-10 flex items-center justify-center border border-gray-200 cursor-pointer`}
                title={
                  sessionActive && !useLocalVideoForIdle
                    ? "Stop Training"
                    : "Start Training"
                }
              >
                {sessionActive && !useLocalVideoForIdle
                  ? "Stop Training"
                  : "Start Training"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
