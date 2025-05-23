import { useCallback, useRef, useEffect, useState } from "react";

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
          className={`disabled:opacity-50 rounded-full p-2 py-6 my-2 w-200 text-white bg-[#EB1700] hover:bg-[#c91400] h-10 flex items-center justify-center border border-gray-200 cursor-pointer`}
          title={
            sessionActive && !useLocalVideoForIdle
              ? "Stop Training"
              : "Start Training"
          }
        >
          <p className="font-medium text-[24px] leading-[100%] tracking-[0%] text-center align-middle">
            {sessionActive && !useLocalVideoForIdle
              ? "Stop Training"
              : "Initiate"}
          </p>
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
                    Welcome to Your Onboarding Jobie!
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">I can help you with:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Learning about company policies</li>
                      <li>Understanding your role and responsibilities</li>
                      {/* <li>Getting started with tools and resources</li>
                      <li>Training and development opportunities</li> */}
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
                  className={`w-full text-center text-black text-sm absolute bottom-2 z-50
                   ${
                     showSubtitles ? "" : "" // ? "" : "hidden"
                   }
                  `}
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
