import { useCallback, useRef } from "react";
import { BsStars } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { MdOutlineMicNone } from "react-icons/md";
import { IoMdArrowUp } from "react-icons/io";

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
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

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
        }
      }
    },
    [handleUserQuery, imgUrl, setImgUrl]
  );

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // For demo purposes, use a fixed image URL.
      const newImgUrl = "https://wallpaperaccess.com/full/528436.jpg";
      setImgUrl(newImgUrl);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col p-4 bg-transparent">
      {/* Assistant messages and videos */}
      <div className="flex justify-end mb-4 space-x-4">
        <div
          className="h-[400px] overflow-y-auto p-2 rounded-lg"
          style={{ scrollbarWidth: "thin" }}
        >
          <div
            id="assistantMessages"
            dangerouslySetInnerHTML={{ __html: assistantMessages }}
          />
        </div>
        <div className="flex items-end relative z-10">
          {useLocalVideoForIdle && !sessionActive && (
            <div id="localVideo">
              <video
                src="/video/lisa-casual-sitting-idle.mp4"
                autoPlay
                loop
                muted
              />
            </div>
          )}
          <div
            id="remoteVideo"
            className="w-[320px] h-[180px]"
            style={{ background: "transparent" }}
          ></div>
          <div
            id="subtitles"
            className={`w-full text-center text-white text-sm absolute bottom-2 z-50 ${
              showSubtitles ? "" : "hidden"
            }`}
            style={{
              textShadow:
                "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            }}
          ></div>
        </div>
      </div>

      {/* Additional control buttons */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 z-50 relative">
        <button
          onClick={startSession}
          disabled={sessionActive && !useLocalVideoForIdle}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full disabled:opacity-50"
          title="Start Session"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </button>

        <button
          onClick={stopSpeaking}
          disabled={!isSpeaking}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full disabled:opacity-50"
          title="Stop Speaking"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z" />
          </svg>
        </button>

        <button
          onClick={clearChatHistory}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
          title="Clear Chat History"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>

        <button
          onClick={stopSession}
          disabled={!sessionActive}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full disabled:opacity-50"
          title="Stop Session"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
          </svg>
        </button>
      </div>

      {/* New Input UI (from ChatFooter) */}
      <footer className="p-2 sm:p-3 md:p-4 flex justify-center mt-auto w-full">
        <div className="w-full bg-white border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 shadow-md">
          <div className="flex items-center space-x-2 mb-2 md:mb-3">
            <BsStars className="text-2xl sm:text-3xl md:text-4xl" />
            <textarea
              ref={textareaRef}
              onKeyUp={handleKeyUp}
              placeholder="Ask me anything..."
              className="flex-1 py-1 px-2 md:px-3 outline-none text-black text-xs sm:text-sm md:text-base resize-none h-[60px]"
              style={{ scrollbarWidth: "thin" }}
            />
          </div>

          <div className="flex justify-between items-center">
            <div
              className="flex items-center border border-gray-300 rounded px-2 py-1 space-x-1 sm:space-x-2 cursor-pointer"
              onClick={handleAttachClick}
            >
              <GrAttachment className="text-2xl" />
              <span className="text-xs sm:text-sm text-black">Attach</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={toggleMicrophone}
                disabled={!sessionActive}
                className="border border-gray-300 rounded p-1 sm:p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
              >
                <MdOutlineMicNone className="text-xl" />
              </button>
              <button
                onClick={() =>
                  textareaRef.current?.dispatchEvent(
                    new KeyboardEvent("keyup", { key: "Enter" })
                  )
                }
                className="border border-gray-300 rounded p-1 sm:p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
              >
                <IoMdArrowUp className="text-xl" />
              </button>
            </div>
          </div>

          {imgUrl && (
            <div className="mt-2">
              <img
                src={imgUrl}
                alt="Uploaded"
                className="w-24 h-24 rounded border"
              />
            </div>
          )}
        </div>
      </footer>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
};

export default MessageBox;
