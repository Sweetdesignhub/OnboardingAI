import jnjLogo from "../assets/jnj.png";
import { BsStars } from "react-icons/bs";
import { FaAngleDown, FaUserCircle } from "react-icons/fa";
import {
  MdCoPresent,
  MdLiveHelp,
  MdOutlineHandyman,
  MdOutlineSettings,
} from "react-icons/md";
import { TbContract } from "react-icons/tb";
import circle from "../assets/circle.mp4";
import frame1 from "../assets/frame1-bg.png";
import frame2 from "../assets/frame2-bg.png";
import frame3 from "../assets/frame3-bg.png";
import AvatarChat from "../components/AvatarChat";

export default function Dashboard() {
  const userName = "Mathew";
  const managerName = "Viswa";

  const config = {
    speech: {
      region: "southeastasia",
      apiKey:
        "4yEIQp26V39RSfLeem530nZx7ev07IpyfadizBcIUao9OkHWhrSjJQQJ99BEACqBBLyXJ3w3AAAYACOGmUY3",
      enablePrivateEndpoint: false,
      EichmannPrivateEndpoint: "",
    },
    openAI: {
      endpoint: "https://athar-ma6hbszz-southindia.openai.azure.com",
      apiKey:
        "3aAKd0F24mOsy1x8eJrqVVdVuTKKUwGX1ySDOJqCaSwhKLDmrTASJQQJ99BEAC77bzfXJ3w3AAAAACOG4Cq3",
      deploymentName: "gpt-4o",
      prompt: "You are an AI assistant that helps people find information.",
    },
    cogSearch: {
      enableOyd: false,
      endpoint: "",
      apiKey: "",
      indexName: "",
    },
    sttTts: {
      sttLocales: "en-US,de-DE,es-ES,fr-FR,it-IT,ja-JP,ko-KR,zh-CN",
      ttsVoice: "en-US-AvaMultilingualNeural",
      customVoiceEndpointId: "",
      personalVoiceSpeakerProfileID: "",
      continuousConversation: false,
    },
    avatar: {
      character: "jeff",
      style: "business",
      customized: false,
      autoReconnect: false,
      useLocalVideoForIdle: false,
      showSubtitles: false,
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4 flex justify-between items-center border-b border-gray-300 shadow-md">
        <div className="flex items-center space-x-2 sm:space-x-15">
          <img
            src={jnjLogo}
            alt="J&J Logo"
            className="h-8 sm:h-10 md:h-12 w-auto cursor-pointer"
          />
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

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 md:py-7">
        <div className="mb-6 md:mb-10 w-full max-w-4xl text-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto mb-4 md:mb-6">
            <video
              src={circle}
              className="w-full h-full rounded-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <h1 className="font-[Poppins] font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight text-center mb-1 sm:mb-2">
            Good Morning, {userName}
          </h1>
          <p className="font-[Poppins] font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight text-center mb-1 sm:mb-2">
            I'm your manager {managerName}
          </p>
          <p className="font-[Poppins] font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight text-center">
            What's on <span className="text-purple-600">your</span>{" "}
            <span className="text-pink-500">mind</span>
            <span className="text-orange-400">?</span>
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
          <div
            className="relative p-4 text-white cursor-pointer bg-cover bg-center rounded-2xl
                       w-full max-w-[200px] h-[100px] sm:max-w-[226px] sm:h-[129px]
                       flex flex-col justify-between items-center mx-auto"
            style={{ backgroundImage: `url(${frame1})` }}
          >
            <h3
              className="text-sm sm:text-base font-semibold leading-tight tracking-tight text-center"
              style={{ fontFamily: "Inter" }}
            >
              Tools & Resources
            </h3>
            <div className="self-start">
              <MdOutlineHandyman className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
          </div>

          <div
            className="relative p-4 text-white cursor-pointer bg-cover bg-center rounded-2xl
                       w-full max-w-[200px] h-[100px] sm:max-w-[226px] sm:h-[129px]
                       flex flex-col justify-between items-center mx-auto"
            style={{ backgroundImage: `url(${frame2})` }}
          >
            <h3
              className="text-sm sm:text-base font-semibold leading-tight tracking-tight text-center"
              style={{ fontFamily: "Inter" }}
            >
              Training & Onboarding
            </h3>
            <div className="self-start">
              <MdCoPresent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
          </div>

          <div
            className="relative p-4 text-white cursor-pointer bg-cover bg-center rounded-2xl
                       w-full max-w-[200px] h-[100px] sm:max-w-[226px] sm:h-[129px]
                       sm:col-span-2 md:col-span-1
                       flex flex-col justify-between items-center mx-auto"
            style={{ backgroundImage: `url(${frame3})` }}
          >
            <h3
              className="text-sm sm:text-base font-semibold leading-tight tracking-tight text-center"
              style={{ fontFamily: "Inter" }}
            >
              Company Policies
            </h3>
            <div className="self-start">
              <TbContract className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
          </div>
        </div>

        {/* Avatar Chat Component */}
        <div className="mt-8 w-full flex items-center justify-center rounded-3xl">
          <AvatarChat config={config} />
        </div>
      </main>
    </div>
  );
}
