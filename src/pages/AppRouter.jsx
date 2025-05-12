import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import ChatPage from "./ChatPage";

// This configuration should be moved to a central config file
// and imported here and in Dashboard.jsx
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

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage config={config} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
