import { useState } from "react";
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
import frame1 from "../../public/frame1-bg.png";
import frame2 from "../../public/frame2-bg.png";
import frame3 from "../../public/frame3-bg.png";
import AvatarChat from "../components/ChatAvatarComponents/AvatarChat";

export default function ChatAvatar() {
  const userName = "Matthew";
  const managerName = "Viswa";
  const [isStarting, setIsStarting] = useState(true);

  const static_knowledge = `
    Onboarding Q&A Reference:

    - Can I apply to multiple roles at once?
      Yes, we strongly encourage applying to multiple roles.

    - How long after the interview will I receive a response?
      We are going through the review process, you can expect a response in 2-3 weeks.

    - How often do I have to come in for hybrid?
      Hybrid means you should be in office for 3 days a week.

    - Tell me about the company culture?
      JNJ fosters a great company culture through diverse ERGs and events. We value your work life balance, creativity and fun.

    - What opportunities are there for learning and growth?
      JNJ provides a learning platform through JNJ Learn. You can acquire new skills, certificates, mentors, and participate in GROW gigs for hands-on experience.

    - What should I do after signing the offer letter?
      After signing the offer letter, you should wait for instructions from HR.

    - What are the activities I need to complete in my first week, month, and first 3 months?
      Visit: https://home.jnj.com/SitePageModern/945382/hiring-manager-first-week

    - Is there an orientation session scheduled for new hires?
      Contact your manager for an in-person orientation if they provide one.

    - Are there team-building social groups I can join?
      Visit: https://inclusionnetwork.jnj.com

    - What ongoing training or development opportunities are available?
      Visit: https://home.jnj.com/sites/j-j-learn/SitePageModern/1327031/j-j-learn
  `;

  const system_prompt = `
You are an expert onboarding assistant. Answer user questions using the provided Q&A below when relevant.
If the question is not covered, give a general onboarding support response like:
"Welcome to JNJ! For detailed support, please contact your manager or HR."

Always respond in 20–30 words—short and clear.

${static_knowledge}
`;

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
      prompt: system_prompt,
      // "You are an expert onboarding assistant. Only respond to questions strictly about the onboarding process. Always give concise answers (20–30 words). Never answer questions outside onboarding topics.",
    },
    cogSearch: {
      enableOyd: false,
      endpoint: "",
      apiKey: "",
      indexName: "",
    },
    sttTts: {
      sttLocales: "en-US,de-DE,es-ES,fr-FR,it-IT,ja-JP,ko-KR,zh-CN",
      ttsVoice: "en-US-CoraMultilingualNeural",
      // ttsVoice: "en-US-ChristopherNeural",
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

  const handleStartingFromGrandchild = (val) => {
    console.log("Starting reached App level:", val);
    setIsStarting(val);
  };

  return (
    <div className=" bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 md:py-7">
        {isStarting && (
          <div>
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
                I'm your AI Recruiter
              </p>
              <p className="font-[Poppins] font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight text-center">
                What's on <span className="text-purple-600">your</span>{" "}
                <span className="text-pink-500">mind</span>
                <span className="text-orange-400">?</span>
              </p>
            </div>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
              <div
                className="relative p-4 text-white cursor-pointer bg-cover bg-center rounded-2xl w-full max-w-[200px] h-[100px] sm:max-w-[226px] sm:h-[129px] flex flex-col justify-between items-center mx-auto"
                style={{ backgroundImage: `url(${frame1})` }}
              >
                <h3
                  className="text-sm sm:text-base font-semibold text-center"
                  style={{ fontFamily: "Inter" }}
                >
                  Tools & Resources
                </h3>
                <div className="self-start">
                  <MdOutlineHandyman className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
              </div>

              <div
                className="relative p-4 text-white cursor-pointer bg-cover bg-center rounded-2xl w-full max-w-[200px] h-[100px] sm:max-w-[226px] sm:h-[129px] flex flex-col justify-between items-center mx-auto"
                style={{ backgroundImage: `url(${frame2})` }}
              >
                <h3
                  className="text-sm sm:text-base font-semibold text-center"
                  style={{ fontFamily: "Inter" }}
                >
                  Training & Onboarding
                </h3>
                <div className="self-start">
                  <MdCoPresent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
              </div>

              <div
                className="relative p-4 text-white cursor-pointer bg-cover bg-center rounded-2xl w-full max-w-[200px] h-[100px] sm:max-w-[226px] sm:h-[129px] sm:col-span-2 md:col-span-1 flex flex-col justify-between items-center mx-auto"
                style={{ backgroundImage: `url(${frame3})` }}
              >
                <h3
                  className="text-sm sm:text-base font-semibold text-center"
                  style={{ fontFamily: "Inter" }}
                >
                  Company Policies
                </h3>
                <div className="self-start">
                  <TbContract className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </div> */}
          </div>
        )}

        {/* Avatar Chat Component */}
        <div className="mt-8 w-full flex items-center justify-center rounded-3xl">
          <AvatarChat
            config={config}
            onStartingChange={handleStartingFromGrandchild}
          />
        </div>
      </main>
    </div>
  );
}
