import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { FaAngleDown, FaUserCircle } from "react-icons/fa";
import { MdOutlineSettings, MdLiveHelp, MdArrowBack } from "react-icons/md";
import AvatarChat from "../components/ChatAvatarComponents/AvatarChat";

export default function ChatPage({ config }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get the query from localStorage or URL params
  useEffect(() => {
    const savedQuery = localStorage.getItem("userQuery");
    if (savedQuery) {
      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: savedQuery,
          timestamp: new Date(),
        },
      ]);

      // Simulate assistant response after a delay
      setIsLoading(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `I've checked your vacation days. You currently have 7 vacation days left for this year.`,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }, 1500);

      // Clear the saved query
      localStorage.removeItem("userQuery");
    }
  }, []);

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4 flex justify-between items-center border-b border-gray-300 shadow-md">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={handleBackClick}
            className="text-gray-700 hover:text-gray-900"
          >
            <MdArrowBack className="text-xl sm:text-2xl" />
          </button>
          
          <div className="flex items-center border border-gray-300 rounded px-2 py-1 space-x-1 sm:space-x-2 cursor-pointer">
            <BsStars className="text-xs sm:text-sm md:text-base" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Version 4.0
            </span>
            <FaAngleDown className="text-xs sm:text-sm md:text-base" />
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
          <MdOutlineSettings className="text-base sm:text-lg md:text-xl cursor-pointer" />
          <MdLiveHelp className="text-base sm:text-lg md:text-xl cursor-pointer" />
          <FaUserCircle className="text-base sm:text-lg md:text-xl cursor-pointer" />
        </div>
      </header>

      {/* Chat content */}
      <main className="flex-1 flex flex-col px-4 py-6 max-w-4xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 p-3 rounded-lg flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
        </div>

        {/* Sources section */}
        {messages.length > 0 && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 flex items-center mb-2">
              <span className="mr-2">📚</span> Sources
            </h3>

            <div className="space-y-2">
              <div className="flex items-center p-2 bg-white rounded border border-gray-200">
                <span className="text-gray-500 mr-2">📄</span>
                <a href="#" className="text-blue-500 hover:underline">
                  Leave Policy PDF
                </a>
              </div>

              <div className="flex items-center p-2 bg-white rounded border border-gray-200">
                <span className="text-gray-500 mr-2">🔗</span>
                <a href="#" className="text-blue-500 hover:underline">
                  Open Time Off Dashboard
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Avatar Chat Component */}
        <div className="mt-auto w-full">
          <AvatarChat config={config} />
        </div>
      </main>
    </div>
  );
}
