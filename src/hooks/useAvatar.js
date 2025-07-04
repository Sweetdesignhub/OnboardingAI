import { useState, useEffect, useRef, useCallback } from "react";

const useAvatar = ({
  speechConfig,
  openAIConfig,
  cogSearchConfig,
  sttTtsConfig,
  avatarConfig,
  enableOyd,
  continuousConversation,
  showSubtitles,
  autoReconnectAvatar,
  useLocalVideoForIdle,
  prompt,
}) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState("");
  const [assistantMessages, setAssistantMessages] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [microphoneText, setMicrophoneText] = useState("Start Microphone");

  const speechRecognizer = useRef(null);
  const avatarSynthesizer = useRef(null);
  const peerConnection = useRef(null);
  const peerConnectionDataChannel = useRef(null);
  const messages = useRef([]);
  const messageInitiated = useRef(false);
  const dataSources = useRef([]);
  const spokenTextQueue = useRef([]);
  const isReconnecting = useRef(false);
  const speakingText = useRef("");
  const lastInteractionTime = useRef(new Date());
  const lastSpeakTime = useRef(null);

  const sentenceLevelPunctuations = [
    ".",
    "?",
    "!",
    ":",
    ";",
    "。",
    "？",
    "！",
    "：",
    "；",
  ];
  const enableDisplayTextAlignmentWithSpeech = true;
  const enableQuickReply = false;
  const quickReplies = [
    "Let me take a look.",
    "Let me check.",
    "One moment, please.",
  ];
  const byodDocRegex = new RegExp(/\[doc(\d+)\]/g);

  useEffect(() => {
    const interval = setInterval(() => {
      checkHung();
      checkLastSpeak();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const remoteVideoDiv = document.getElementById("remoteVideo");
    if (remoteVideoDiv && sessionActive) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          console.log("remoteVideo DOM changed:", mutation);
          if (
            !document.getElementById("videoPlayer") &&
            peerConnection.current
              ?.getReceivers()
              .some((r) => r.track.kind === "video")
          ) {
            console.warn("Video element removed, re-adding...");
            const stream = peerConnection.current
              .getReceivers()
              .find((r) => r.track.kind === "video")?.track?.stream;
            if (stream) {
              const videoElement = document.createElement("video");
              videoElement.id = "videoPlayer";
              videoElement.srcObject = stream;
              videoElement.autoplay = true;
              videoElement.playsInline = true;
              videoElement.style.width = "450px";
              videoElement.style.height = "300px";
              remoteVideoDiv.appendChild(videoElement);
              console.log("Video element re-added to DOM");
            }
          }
        });
      });
      observer.observe(remoteVideoDiv, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [sessionActive]);

  const connectAvatar = useCallback(() => {
    console.log("Starting avatar connection...");
    setErrorMessage("");
    if (speechConfig.apiKey === "") {
      setErrorMessage("Please fill in the API key of your speech resource.");
      return;
    }
    if (
      speechConfig.enablePrivateEndpoint &&
      speechConfig.privateEndpoint === ""
    ) {
      setErrorMessage("Please fill in the Azure Speech endpoint.");
      return;
    }
    if (
      openAIConfig.endpoint === "" ||
      openAIConfig.apiKey === "" ||
      openAIConfig.deploymentName === ""
    ) {
      setErrorMessage(
        "Please fill in the Azure OpenAI endpoint, API key, and deployment name."
      );
      return;
    }
    if (
      enableOyd &&
      (cogSearchConfig.endpoint === "" ||
        cogSearchConfig.apiKey === "" ||
        cogSearchConfig.indexName === "")
    ) {
      setErrorMessage(
        "Please fill in the Azure Cognitive Search endpoint, API key, and index name."
      );
      return;
    }

    let speechSynthesisConfig;
    if (speechConfig.enablePrivateEndpoint) {
      speechSynthesisConfig = SpeechSDK.SpeechConfig.fromEndpoint(
        new URL(
          `wss://${speechConfig.privateEndpoint.slice(
            8
          )}/tts/cognitiveservices/websocket/v1?enableTalkingAvatar=true`
        ),
        speechConfig.apiKey
      );
    } else {
      speechSynthesisConfig = SpeechSDK.SpeechConfig.fromSubscription(
        speechConfig.apiKey,
        speechConfig.region
      );
    }
    speechSynthesisConfig.endpointId = sttTtsConfig.customVoiceEndpointId;

    const avatarSdkConfig = new SpeechSDK.AvatarConfig(
      "meg", // Set avatar character here.
      "formal" // Set avatar style here.
      // avatarConfig.character,
      // avatarConfig.style
    );
    // avatarSdkConfig.backgroundColor = "#00000000"; // Set background color to green
    avatarSdkConfig.customized = avatarConfig.customized;
    avatarSynthesizer.current = new SpeechSDK.AvatarSynthesizer(
      speechSynthesisConfig,
      avatarSdkConfig
    );
    avatarSynthesizer.current.avatarEventReceived = (s, e) => {
      console.log(
        `Avatar event received: ${e.description}, offset: ${e.offset / 10000}ms`
      );
    };

    const speechRecognitionConfig = SpeechSDK.SpeechConfig.fromEndpoint(
      new URL(
        `wss://${speechConfig.region}.stt.speech.microsoft.com/speech/universal/v2`
      ),
      speechConfig.apiKey
    );
    speechRecognitionConfig.setProperty(
      SpeechSDK.PropertyId.SpeechServiceConnection_LanguageIdMode,
      "Continuous"
    );
    const autoDetectSourceLanguageConfig =
      SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages(
        sttTtsConfig.sttLocales.split(",")
      );
    speechRecognizer.current = SpeechSDK.SpeechRecognizer.FromConfig(
      speechRecognitionConfig,
      autoDetectSourceLanguageConfig,
      SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
    );

    if (!messageInitiated.current) {
      initMessages();
      messageInitiated.current = true;
    }

    const xhr = new XMLHttpRequest();
    const url = speechConfig.enablePrivateEndpoint
      ? `https://${speechConfig.privateEndpoint.slice(
          8
        )}/tts/cognitiveservices/avatar/relay/token/v1`
      : `https://${speechConfig.region}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`;
    xhr.open("GET", url);
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", speechConfig.apiKey);
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          const responseData = JSON.parse(this.responseText);
          setupWebRTC(
            responseData.Urls[0],
            responseData.Username,
            responseData.Password
          );
        } else {
          setErrorMessage(
            `Failed to fetch WebRTC token: ${this.status} ${this.statusText}`
          );
        }
      }
    };
    xhr.send();
    console.log("WebRTC token request sent:", url);
  }, [
    speechConfig,
    openAIConfig,
    cogSearchConfig,
    enableOyd,
    sttTtsConfig,
    avatarConfig,
  ]);

  const disconnectAvatar = useCallback(() => {
    console.log("Disconnecting avatar...");
    if (avatarSynthesizer.current) {
      avatarSynthesizer.current.close();
      avatarSynthesizer.current = null;
    }
    if (speechRecognizer.current) {
      speechRecognizer.current.stopContinuousRecognitionAsync();
      speechRecognizer.current.close();
      speechRecognizer.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setSessionActive(false);
    console.log("Avatar disconnected");
  }, []);

  const setupWebRTC = useCallback(
    (iceServerUrl, iceServerUsername, iceServerCredential) => {
      console.log("Setting up WebRTC with ICE server:", iceServerUrl);
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: [iceServerUrl],
            username: iceServerUsername,
            credential: iceServerCredential,
          },
        ],
      });

      peerConnection.current.ontrack = (event) => {
        const remoteVideoDiv = document.getElementById("remoteVideo");
        if (!remoteVideoDiv) {
          console.error("remoteVideo div not found");
          setErrorMessage("Video container not found in DOM.");
          return;
        }
        if (event.track.kind === "audio") {
          if (!document.getElementById("audioPlayer")) {
            const audioElement = document.createElement("audio");
            audioElement.id = "audioPlayer";
            audioElement.srcObject = event.streams[0];
            audioElement.autoplay = true;
            audioElement.onplay = () => console.log("Audio playback started");
            audioElement.onerror = (e) =>
              console.error("Audio element error:", e);
            remoteVideoDiv.appendChild(audioElement);
            console.log("Audio element added to DOM");
          }
        } else if (event.track.kind === "video") {
          if (!document.getElementById("videoPlayer")) {
            const videoElement = document.createElement("video");
            videoElement.id = "videoPlayer";
            videoElement.srcObject = event.streams[0];
            videoElement.autoplay = true;
            videoElement.playsInline = true;
            videoElement.style.width = "450px";
            videoElement.style.height = "300px";
            remoteVideoDiv.appendChild(videoElement);
            console.log("Video element added to DOM");
            setSessionActive(true);
          }
        }
      };

      peerConnection.current.addEventListener("datachannel", (event) => {
        peerConnectionDataChannel.current = event.channel;
        peerConnectionDataChannel.current.onmessage = (e) => {
          const webRTCEvent = JSON.parse(e.data);
          const subtitles = document.getElementById("subtitles");
          if (
            webRTCEvent.event.eventType === "EVENT_TYPE_TURN_START" &&
            showSubtitles
          ) {
            subtitles.hidden = false;
            subtitles.innerHTML = speakingText.current;
          } else if (
            webRTCEvent.event.eventType === "EVENT_TYPE_SESSION_END" ||
            webRTCEvent.event.eventType === "EVENT_TYPE_SWITCH_TO_IDLE"
          ) {
            subtitles.hidden = true;
          }
          console.log(`WebRTC event: ${e.data}`);
        };
      });

      peerConnection.current.oniceconnectionstatechange = () => {
        console.log(
          `WebRTC status: ${peerConnection.current.iceConnectionState}`
        );
        if (peerConnection.current.iceConnectionState === "failed") {
          setErrorMessage(
            "WebRTC connection failed. Check network or firewall settings."
          );
        }
      };

      peerConnection.current.createDataChannel("eventChannel");
      peerConnection.current.addTransceiver("video", { direction: "sendrecv" });
      peerConnection.current.addTransceiver("audio", { direction: "sendrecv" });

      avatarSynthesizer.current
        .startAvatarAsync(peerConnection.current)
        .then((r) => {
          if (r.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            console.log(`Avatar started. Result ID: ${r.resultId}`);
          } else {
            console.error(`Unable to start avatar. Result ID: ${r.resultId}`);
            setErrorMessage(
              "Avatar failed to start. Check console for details."
            );
          }
        })
        .catch((error) => {
          console.error(`Avatar failed to start: ${error}`);
          setErrorMessage("Failed to start avatar. Check console for details.");
        });
    },
    [showSubtitles]
  );

  const initMessages = useCallback(() => {
    messages.current = [];
    if (dataSources.current.length === 0) {
      messages.current.push({ role: "system", content: prompt });
    }
  }, [prompt]);

  const htmlEncode = (text) => {
    const entityMap = {
      "&": "&",
      "<": "<",
      ">": ">",
      '"': '"',
      "'": "",
      "/": "/",
    };
    return String(text).replace(/[&<>"'\/]/g, (match) => entityMap[match]);
  };

  const speak = useCallback(
    (text, endingSilenceMs = 0) => {
      if (isSpeaking) {
        spokenTextQueue.current.push(text);
        return;
      }
      speakNext(text, endingSilenceMs);
    },
    [isSpeaking]
  );

  const speakNext = useCallback(
    (text, endingSilenceMs = 0, skipUpdatingChatHistory = false) => {
      // let ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='${
      //   sttTtsConfig.ttsVoice
      // }'><mstts:ttsembedding speakerProfileId='${
      //   sttTtsConfig.personalVoiceSpeakerProfileID
      // }'><mstts:leadingsilence-exact value='0'/>${htmlEncode(
      //   text
      // )}</mstts:ttsembedding></voice></speak>`;
      // if (endingSilenceMs > 0) {
      //   ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='${
      //     sttTtsConfig.ttsVoice
      //   }'><mstts:ttsembedding speakerProfileId='${
      //     sttTtsConfig.personalVoiceSpeakerProfileID
      //   }'><mstts:leadingsilence-exact value='0'/>${htmlEncode(
      //     text
      //   )}<break time='${endingSilenceMs}ms' /></mstts:ttsembedding></voice></speak>`;
      // }
      let ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='en-US-CoraMultilingualNeural'><mstts:ttsembedding speakerProfileId='${
        sttTtsConfig.personalVoiceSpeakerProfileID
      }'><mstts:leadingsilence-exact value='0'/>${htmlEncode(
        text
      )}</mstts:ttsembedding></voice></speak>`;
      if (endingSilenceMs > 0) {
        ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='en-US-CoraMultilingualNeural'><mstts:ttsembedding speakerProfileId='${
          sttTtsConfig.personalVoiceSpeakerProfileID
        }'><mstts:leadingsilence-exact value='0'/>${htmlEncode(
          text
        )}<break time='${endingSilenceMs}ms' /></mstts:ttsembedding></voice></speak>`;
      }

      if (enableDisplayTextAlignmentWithSpeech && !skipUpdatingChatHistory) {
        setAssistantMessages(
          (prev) =>
            `${prev}<div class="flex justify-end mb-2"><div class=" bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${text}</div></div>`
        );
        console.log("TEXT: ", text);
        // Chat Histroy

        // setChatHistory(
        //   (prev) =>
        //     `${prev}<div class="flex justify-end mb-2"><div class=" bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${text}</div></div>`
        // );

        // setChatHistory(
        //   (prev) =>
        //     `${prev}<div class="flex justify-end mb-2"><div class=" bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${text.replace(
        //       /\n/g,
        //       "<br/>"
        //     )}</div></div>`
        // );
        const assistantMessagesDiv =
          document.getElementById("assistantMessages");
        if (assistantMessagesDiv) assistantMessagesDiv.scrollTop = 0;
      }

      setIsSpeaking(true);
      speakingText.current = text;
      lastSpeakTime.current = new Date();
      avatarSynthesizer.current
        .speakSsmlAsync(ssml)
        .then((result) => {
          if (
            result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
          ) {
            console.log(
              `Speech synthesized for text [${text}]. Result ID: ${result.resultId}`
            );
          } else {
            console.error(`Error speaking SSML. Result ID: ${result.resultId}`);
            setErrorMessage("Failed to synthesize speech.");
          }
          speakingText.current = "";
          if (spokenTextQueue.current.length > 0) {
            speakNext(spokenTextQueue.current.shift());
          } else {
            setIsSpeaking(false);
            const textarea = document.getElementById("userMessageBox");
            if (textarea) textarea.value = "";
          }
        })
        .catch((error) => {
          console.error(`Error speaking SSML: ${error}`);
          setErrorMessage("Error synthesizing speech.");
          speakingText.current = "";
          if (spokenTextQueue.current.length > 0) {
            speakNext(spokenTextQueue.current.shift());
          } else {
            setIsSpeaking(false);
            const textarea = document.getElementById("userMessageBox");
            if (textarea) textarea.value = "";
          }
        });
    },
    [sttTtsConfig]
  );

  const stopSpeaking = useCallback(() => {
    console.log("Stop speaking clicked");
    lastInteractionTime.current = new Date();
    spokenTextQueue.current = [];
    avatarSynthesizer.current
      .stopSpeakingAsync()
      .then(() => {
        setIsSpeaking(false);
        console.log("Stop speaking request sent.");
        const textarea = document.getElementById("userMessageBox");
        if (textarea) textarea.value = "";
      })
      .catch((error) => {
        console.error(`Error stopping speaking: ${error}`);
        setErrorMessage("Error stopping speech.");
        const textarea = document.getElementById("userMessageBox");
        if (textarea) textarea.value = "";
      });
  }, []);

  // Helper function to shorten URL using TinyURL
  async function shortenUrl(longUrl) {
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
      );
      if (!response.ok) throw new Error("Failed to shorten URL");
      const shortUrl = await response.text();
      return shortUrl;
    } catch (err) {
      console.error("URL shortening failed:", err);
      return longUrl; // fallback to original URL
    }
  }

  const formatDateTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      };
      return date.toLocaleString("en-US", options);
    } catch (error) {
      console.error("❌ Failed to format date:", isoString, error);
      return isoString;
    }
  };

  const handleUserQuery = useCallback(
    (userQuery, userQueryHTML, imgUrlPath) => {
      console.log("Handling user query:", userQuery);
      lastInteractionTime.current = new Date();
      let contentMessage = userQuery;
      if (imgUrlPath.trim()) {
        contentMessage = [
          { type: "text", text: userQuery },
          { type: "image_url", image_url: { url: imgUrlPath } },
        ];
      }
      messages.current.push({ role: "user", content: contentMessage });
      setChatHistory(
        (prev) =>
          `${prev}<div class="flex justify-start mb-2"><div class="bg-blue-100 bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${userQueryHTML}</div></div>`
      );
      const chatHistoryDiv = document.getElementById("chatHistory");
      if (chatHistoryDiv) chatHistoryDiv.scrollTop = 0;

      if (isSpeaking) {
        stopSpeaking();
      }

      // Check if the user is requesting to schedule a call/meeting
      const schedulingKeywords = [
        "schedule a call",
        "schedule a meeting",
        "set up a meeting",
        "set up a call",
        "book a meeting",
        "arrange a call",
        "organize a meeting",
      ];

      const isSchedulingRequest = schedulingKeywords.some((keyword) =>
        userQuery.toLowerCase().includes(keyword)
      );

      if (isSchedulingRequest) {
        // Extract meeting information from the user query
        // This is a simple implementation - you might want to use more advanced NLP
        let subject = "Meeting for Onboarding Matthew";
        let durationMinutes = 30;
        let attendees = ["email@service.com", "m.gopalkrishnareddy2@gmail.com"];
        let description =
          "Meeting scheduled for Onboarding Process via Onboarding Jobie";

        // Extract email addresses from the query
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
        const extractedEmails = userQuery.match(emailRegex) || [];
        if (extractedEmails.length > 0) {
          attendees = extractedEmails;
        }

        // Try to extract meeting subject
        const subjectMatch = userQuery.match(
          /(?:about|regarding|for|on) ["']?([^"']+)["']?/i
        );
        if (subjectMatch && subjectMatch[1]) {
          subject = subjectMatch[1].trim();
        }

        // Try to extract duration
        const durationMatch = userQuery.match(
          /(\d+)\s*(?:min|minute|minutes)/i
        );
        if (durationMatch && durationMatch[1]) {
          durationMinutes = parseInt(durationMatch[1], 10);
        }

        // Try to extract description
        const descriptionMatch = userQuery.match(
          /description:?\s*["']?([^"']+)["']?/i
        );
        if (descriptionMatch && descriptionMatch[1]) {
          description = descriptionMatch[1].trim();
        }

        // Prepare request body for scheduling API
        const meetingData = {
          subject: subject,
          durationMinutes: durationMinutes,
          attendees: attendees,
          description: description,
        };

        console.log("Scheduling meeting with data:", meetingData);

        // Make request to scheduling API
        fetch("https://callscheduler.onrender.com/auto-schedule-outlook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(meetingData),
        })
          .then((response) => {
            if (!response.ok) {
              console.error(
                `Scheduling API response status: ${response.status} ${response.statusText}`
              );
              setErrorMessage(
                `Failed to schedule meeting: ${response.status} ${response.statusText}`
              );
              return response.text().then((text) => {
                throw new Error(`Failed to schedule meeting: ${text}`);
              });
            }
            return response.json();
          })
          .then(async (data) => {
            console.log("Meeting scheduled successfully:", data);

            const shortUrl = await shortenUrl(data.joinUrl);
            console.log("SGORTEN URL: ", shortUrl);
            // Format response to user
            const meetingResponse = `Meeting scheduled successfully!\n Meeting URL:${shortUrl}\nSubject: ${subject}\nDuration: ${durationMinutes} minutes\nStart Time: ${formatDateTime(
              data.start
            )}\nEnd Time: ${formatDateTime(
              data.end
            )}\nAttendees: ${attendees.join(
              ", "
            )}\nDescription: ${description}`;

            // Update messages state
            messages.current.push({
              role: "assistant",
              content: meetingResponse,
            });

            console.log("MEETING RESPONSE: ", meetingResponse);
            // // Display response to user
            setAssistantMessages(
              (prev) =>
                `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${meetingResponse}</div></div>`
            );

            // Update chat history
            setChatHistory(
              (prev) =>
                `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${meetingResponse}</div></div>`
            );

            // Have the avatar read the meeting confirmation
            speak(meetingResponse);
          })
          .catch((error) => {
            console.error(`Scheduling error: ${error}`);

            const errorMessage =
              "Sorry, I wasn't able to schedule that meeting. Please check the details and try again.";

            messages.current.push({
              role: "assistant",
              content: errorMessage,
            });

            setAssistantMessages(
              (prev) =>
                `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${errorMessage}</div></div>`
            );

            setChatHistory(
              (prev) =>
                `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${errorMessage}</div></div>`
            );

            // Have the avatar read the error message
            speak(errorMessage);
          });

        return; // Exit the function early since we've handled the scheduling request
      }

      if (dataSources.current.length > 0 && enableQuickReply) {
        speak(getQuickReply(), 2000);
      }

      const url =
        dataSources.current.length > 0
          ? `${openAIConfig.endpoint}/openai/deployments/${openAIConfig.deploymentName}/extensions/chat/completions?api-version=2023-06-01-preview`
          : `${openAIConfig.endpoint}/openai/deployments/${openAIConfig.deploymentName}/chat/completions?api-version=2023-06-01-preview`;

      const body = JSON.stringify({
        dataSources:
          dataSources.current.length > 0 ? dataSources.current : undefined,
        messages: messages.current,
        stream: true,
      });

      let assistantReply = "";
      let toolContent = "";
      let spokenSentence = "";
      let displaySentence = "";

      fetch(url, {
        method: "POST",
        headers: {
          "api-key": openAIConfig.apiKey,
          "Content-Type": "application/json",
        },
        body,
      })
        .then((response) => {
          if (!response.ok) {
            console.error(
              `Chat API response status: ${response.status} ${response.statusText}`
            );
            setErrorMessage(
              `Failed to connect to OpenAI API: ${response.status} ${response.statusText}`
            );
            return;
          }
          const reader = response.body.getReader();
          const read = (previousChunkString = "") => {
            return reader.read().then(({ value, done }) => {
              if (done) {
                if (spokenSentence) {
                  speak(spokenSentence);
                  spokenSentence = "";
                }
                if (dataSources.current.length > 0 && toolContent) {
                  messages.current.push({ role: "tool", content: toolContent });
                }
                if (assistantReply) {
                  messages.current.push({
                    role: "assistant",
                    content: assistantReply,
                  });
                }
                console.log(
                  "Stream completed. Final assistant reply:",
                  messages.current
                );
                setChatHistory(
                  (prev) =>
                    `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${displaySentence}</div></div>`
                );
                return;
              }
              let chunkString = new TextDecoder().decode(value, {
                stream: true,
              });
              if (previousChunkString)
                chunkString = previousChunkString + chunkString;
              if (
                !chunkString.endsWith("}\n\n") &&
                !chunkString.endsWith("[DONE]\n\n")
              )
                return read(chunkString);

              chunkString.split("\n\n").forEach((line) => {
                if (line.startsWith("data:") && !line.endsWith("[DONE]")) {
                  try {
                    const responseJson = JSON.parse(line.substring(5).trim());
                    let responseToken =
                      dataSources.current.length === 0
                        ? responseJson.choices?.[0]?.delta?.content
                        : responseJson.choices?.[0]?.messages?.[0]?.delta
                            ?.content;
                    if (responseToken) {
                      if (byodDocRegex.test(responseToken)) {
                        responseToken = responseToken
                          .replace(byodDocRegex, "")
                          .trim();
                      }
                      if (responseToken === "[DONE]") responseToken = undefined;
                    }
                    if (responseToken) {
                      assistantReply += responseToken;
                      displaySentence += responseToken;
                      spokenSentence += responseToken;
                      if (responseToken === "\n" || responseToken === "\n\n") {
                        speak(spokenSentence);
                        spokenSentence = "";
                      } else {
                        responseToken = responseToken.replace(/\n/g, "");
                        if (
                          responseToken.length === 1 ||
                          responseToken.length === 2
                        ) {
                          for (const punctuation of sentenceLevelPunctuations) {
                            if (responseToken.startsWith(punctuation)) {
                              speak(spokenSentence);
                              spokenSentence = "";
                              break;
                            }
                          }
                        }
                      }
                    }

                    if (!enableDisplayTextAlignmentWithSpeech) {
                      setAssistantMessages(
                        (prev) =>
                          `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${displaySentence}</div></div>`
                      );
                      console.log("DISPLAY SENTENCE: ", displaySentence);
                      // Chat History
                      setChatHistory(
                        (prev) =>
                          `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${displaySentence}</div></div>`
                      );

                      const assistantMessagesDiv =
                        document.getElementById("assistantMessages");
                      if (assistantMessagesDiv)
                        assistantMessagesDiv.scrollTop = 0;

                      // For non-meeting responses, ensure we speak the content
                      // when it's a complete sentence or chunk
                      speak(displaySentence);
                      displaySentence = "";
                    }
                  } catch (error) {
                    console.error(
                      `Error parsing response: ${error}, chunk: ${line}`
                    );
                    setErrorMessage("Error processing API response.");
                  }
                }
              });
              return read();
            });
          };
          setAssistantMessages((prev) => `${prev}`);
          // Chat History

          setChatHistory((prev) => `${prev}`);
          return read();
        })
        .catch((error) => {
          console.error(`Fetch error: ${error}`);
          setErrorMessage("Failed to connect to OpenAI API.");
        });
    },
    [openAIConfig, isSpeaking, stopSpeaking, speak, enableOyd]
  );

  const getQuickReply = () =>
    quickReplies[Math.floor(Math.random() * quickReplies.length)];

  const checkHung = useCallback(() => {
    const videoElement = document.getElementById("videoPlayer");
    if (videoElement && sessionActive) {
      const videoTime = videoElement.currentTime;
      setTimeout(() => {
        if (
          videoElement.currentTime === videoTime &&
          sessionActive &&
          autoReconnectAvatar &&
          new Date() - lastInteractionTime.current < 300000
        ) {
          console.log("Video stream disconnected, reconnecting...");
          isReconnecting.current = true;
          disconnectAvatar();
          connectAvatar();
        }
      }, 2000);
    }
  }, [sessionActive, autoReconnectAvatar, disconnectAvatar, connectAvatar]);

  const checkLastSpeak = useCallback(() => {
    if (
      lastSpeakTime.current &&
      new Date() - lastSpeakTime.current > 15000 &&
      useLocalVideoForIdle &&
      sessionActive &&
      !isSpeaking
    ) {
      disconnectAvatar();
      document.getElementById("localVideo").hidden = false;
      document.getElementById("remoteVideo").style.width = "0.1px";
      setSessionActive(false);
    }
  }, [useLocalVideoForIdle, sessionActive, isSpeaking, disconnectAvatar]);

  const startSession = useCallback(() => {
    console.log("Start session clicked");
    lastInteractionTime.current = new Date();
    if (useLocalVideoForIdle) {
      document.getElementById("localVideo").hidden = false;
      document.getElementById("remoteVideo").style.width = "0.1px";
      setSessionActive(true);
      return;
    }
    connectAvatar();
  }, [useLocalVideoForIdle, connectAvatar]);

  const stopSession = useCallback(() => {
    console.log("Stop session clicked");
    lastInteractionTime.current = new Date();
    disconnectAvatar();
    document.getElementById("localVideo").hidden = true;
  }, [disconnectAvatar]);

  const clearChatHistory = useCallback(() => {
    console.log("Clear chat history clicked");
    lastInteractionTime.current = new Date();
    setChatHistory("");
    setAssistantMessages("");
    initMessages();
  }, [initMessages]);

  const toggleMicrophone = useCallback(async () => {
    console.log("Toggle microphone clicked");
    lastInteractionTime.current = new Date();
    if (microphoneText === "Stop Microphone") {
      speechRecognizer.current.stopContinuousRecognitionAsync(
        () => {
          setMicrophoneText("Start Microphone");
          console.log("Microphone stopped");
        },
        (err) => {
          console.error(`Failed to stop recognition: ${err}`);
          setErrorMessage("Failed to stop microphone.");
        }
      );
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");

      if (useLocalVideoForIdle && !sessionActive) {
        connectAvatar();
        setTimeout(() => {
          const audioPlayer = document.getElementById("audioPlayer");
          if (audioPlayer)
            audioPlayer
              .play()
              .catch((e) => console.error(`Audio play error: ${e}`));
        }, 5000);
      } else {
        const audioPlayer = document.getElementById("audioPlayer");
        if (audioPlayer)
          audioPlayer
            .play()
            .catch((e) => console.error(`Audio play error: ${e}`));
      }

      speechRecognizer.current.recognizing = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizingSpeech) {
          const userQuery = e.result.text.trim();
          console.log("Speech recognizing:", userQuery);
          if (userQuery) {
            const textarea = document.getElementById("userMessageBox");
            if (textarea) {
              textarea.value = userQuery;
            }
          }
        }
      };

      speechRecognizer.current.recognized = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          const userQuery = e.result.text.trim();
          console.log("Speech recognized:", userQuery);
          if (userQuery) {
            const userQueryHTML = userQuery;
            handleUserQuery(userQuery, userQueryHTML, "");
            const textarea = document.getElementById("userMessageBox");
            if (textarea) textarea.value = "";
          }
          if (!continuousConversation) {
            speechRecognizer.current.stopContinuousRecognitionAsync(
              () => {
                setMicrophoneText("Start Microphone");
                console.log("Microphone stopped after recognition");
              },
              (err) => console.error(`Failed to stop recognition: ${err}`)
            );
          }
        }
      };

      speechRecognizer.current.startContinuousRecognitionAsync(
        () => {
          setMicrophoneText("Stop Microphone");
          console.log("Microphone started");
        },
        (err) => {
          console.error(`Failed to start recognition: ${err}`);
          setErrorMessage("Failed to start microphone.");
        }
      );
    } catch (err) {
      console.error(`Microphone permission error: ${err}`);
      setErrorMessage("Microphone access denied.");
    }
  }, [
    useLocalVideoForIdle,
    sessionActive,
    continuousConversation,
    connectAvatar,
    handleUserQuery,
    microphoneText,
  ]);

  return {
    sessionActive,
    isSpeaking,
    chatHistory,
    assistantMessages,
    errorMessage,
    microphoneText,
    startSession,
    stopSession,
    toggleMicrophone,
    stopSpeaking,
    clearChatHistory,
    handleUserQuery,
  };
};

export default useAvatar;

// const handleUserQuery = useCallback(
//   (userQuery, userQueryHTML, imgUrlPath) => {
//     console.log("Handling user query:", userQuery);
//     lastInteractionTime.current = new Date();
//     let contentMessage = userQuery;
//     if (imgUrlPath.trim()) {
//       contentMessage = [
//         { type: "text", text: userQuery },
//         { type: "image_url", image_url: { url: imgUrlPath } },
//       ];
//     }
//     messages.current.push({ role: "user", content: contentMessage });
//     setChatHistory(
//       (prev) =>
//         `${prev}<div class="flex justify-start mb-2"><div class="bg-blue-100 bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${userQueryHTML}</div></div>`
//     );
//     const chatHistoryDiv = document.getElementById("chatHistory");
//     if (chatHistoryDiv) chatHistoryDiv.scrollTop = 0;

//     if (isSpeaking) {
//       stopSpeaking();
//     }

//     // Check if the user is requesting to schedule a call/meeting
//     const schedulingKeywords = [
//       "schedule a call",
//       "schedule a meeting",
//       "set up a meeting",
//       "set up a call",
//       "book a meeting",
//       "arrange a call",
//       "organize a meeting",
//     ];

//     const isSchedulingRequest = schedulingKeywords.some((keyword) =>
//       userQuery.toLowerCase().includes(keyword)
//     );

//     if (isSchedulingRequest) {
//       // Extract meeting information from the user query
//       // This is a simple implementation - you might want to use more advanced NLP
//       let subject = "Meeting for Onboarding Matthew";
//       let durationMinutes = 30;
//       let attendees = [
//         "nandu@sweetdesignhub.com",
//         "atharva2003chavan@gmail.com",
//         "md.sultan076@gmail.com",
//         "m.gopalkrishnareddy2@gmail.com",
//       ];
//       let description =
//         "Meeting scheduled for Onboarding Process via Onboarding Genie";

//       // // Extract email addresses from the query
//       // const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
//       // const extractedEmails = userQuery.match(emailRegex) || [];
//       // if (extractedEmails.length > 0) {
//       //   attendees = extractedEmails;
//       // }

//       // Try to extract meeting subject
//       const subjectMatch = userQuery.match(
//         /(?:about|regarding|for|on) ["']?([^"']+)["']?/i
//       );
//       if (subjectMatch && subjectMatch[1]) {
//         subject = subjectMatch[1].trim();
//       }

//       // Try to extract duration
//       const durationMatch = userQuery.match(
//         /(\d+)\s*(?:min|minute|minutes)/i
//       );
//       if (durationMatch && durationMatch[1]) {
//         durationMinutes = parseInt(durationMatch[1], 10);
//       }

//       // Try to extract description
//       const descriptionMatch = userQuery.match(
//         /description:?\s*["']?([^"']+)["']?/i
//       );
//       if (descriptionMatch && descriptionMatch[1]) {
//         description = descriptionMatch[1].trim();
//       }

//       // Prepare request body for scheduling API
//       const meetingData = {
//         subject: subject,
//         durationMinutes: durationMinutes,
//         attendees: attendees,
//         description: description,
//       };

//       console.log("Scheduling meeting with data:", meetingData);

//       // Make request to scheduling API
//       fetch("http://localhost:3000/auto-schedule-outlook", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(meetingData),
//       })
//         .then((response) => {
//           if (!response.ok) {
//             console.error(
//               `Scheduling API response status: ${response.status} ${response.statusText}`
//             );
//             setErrorMessage(
//               `Failed to schedule meeting: ${response.status} ${response.statusText}`
//             );
//             return response.text().then((text) => {
//               throw new Error(`Failed to schedule meeting: ${text}`);
//             });
//           }
//           return response.json();
//         })
//         .then((data) => {
//           console.log("Meeting scheduled successfully:", data);

//           // Format response to user
//           const meetingResponse = `Meeting scheduled successfully!\n\nSubject: ${subject}\nDuration: ${durationMinutes} minutes\n Start Time: ${
//             data.start
//           }\n End Time: ${data.end}\nAttendees: ${attendees.join(
//             ", "
//           )}\nDescription: ${description}`;

//           // Update messages state
//           messages.current.push({
//             role: "assistant",
//             content: meetingResponse,
//           });

//           // Display response to user
//           setAssistantMessages(
//             (prev) =>
//               `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${meetingResponse.replace(
//                 /\n/g,
//                 "<br/>"
//               )}</div></div>`
//           );

//           // Update chat history
//           setChatHistory(
//             (prev) =>
//               `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${meetingResponse.replace(
//                 /\n/g,
//                 "<br/>"
//               )}</div></div>`
//           );
//         })
//         .catch((error) => {
//           console.error(`Scheduling error: ${error}`);

//           const errorMessage =
//             "Sorry, I wasn't able to schedule that meeting. Please check the details and try again.";

//           messages.current.push({
//             role: "assistant",
//             content: errorMessage,
//           });

//           setAssistantMessages(
//             (prev) =>
//               `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${errorMessage}</div></div>`
//           );

//           setChatHistory(
//             (prev) =>
//               `${prev}<div class="flex justify-end mb-2"><div class="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${errorMessage}</div></div>`
//           );
//         });

//       return; // Exit the function early since we've handled the scheduling request
//     }

//     if (dataSources.current.length > 0 && enableQuickReply) {
//       speak(getQuickReply(), 2000);
//     }

//     const url =
//       dataSources.current.length > 0
//         ? `${openAIConfig.endpoint}/openai/deployments/${openAIConfig.deploymentName}/extensions/chat/completions?api-version=2023-06-01-preview`
//         : `${openAIConfig.endpoint}/openai/deployments/${openAIConfig.deploymentName}/chat/completions?api-version=2023-06-01-preview`;

//     const body = JSON.stringify({
//       dataSources:
//         dataSources.current.length > 0 ? dataSources.current : undefined,
//       messages: messages.current,
//       stream: true,
//     });
//     // const lastContent =
//     //   messages.current?.[messages.current.length - 1]?.content;

//     // const newBody = JSON.stringify({
//     //   questions: lastContent,
//     // });

//     // console.log("body: ", newBody);
//     let assistantReply = "";
//     let toolContent = "";
//     let spokenSentence = "";
//     let displaySentence = "";

//     fetch(url, {
//       method: "POST",
//       headers: {
//         "api-key": openAIConfig.apiKey,
//         "Content-Type": "application/json",
//       },
//       body,
//     })
//       .then((response) => {
//         if (!response.ok) {
//           console.error(
//             `Chat API response status: ${response.status} ${response.statusText}`
//           );
//           setErrorMessage(
//             `Failed to connect to OpenAI API: ${response.status} ${response.statusText}`
//           );
//           return;
//         }
//         const reader = response.body.getReader();
//         const read = (previousChunkString = "") => {
//           return reader.read().then(({ value, done }) => {
//             if (done) {
//               if (spokenSentence) {
//                 speak(spokenSentence);
//                 spokenSentence = "";
//               }
//               if (dataSources.current.length > 0 && toolContent) {
//                 messages.current.push({ role: "tool", content: toolContent });
//               }
//               if (assistantReply) {
//                 messages.current.push({
//                   role: "assistant",
//                   content: assistantReply,
//                 });
//               }
//               console.log(
//                 "Stream completed. Final assistant reply:",
//                 assistantReply
//               );
//               return;
//             }
//             let chunkString = new TextDecoder().decode(value, {
//               stream: true,
//             });
//             if (previousChunkString)
//               chunkString = previousChunkString + chunkString;
//             if (
//               !chunkString.endsWith("}\n\n") &&
//               !chunkString.endsWith("[DONE]\n\n")
//             )
//               return read(chunkString);

//             chunkString.split("\n\n").forEach((line) => {
//               if (line.startsWith("data:") && !line.endsWith("[DONE]")) {
//                 try {
//                   const responseJson = JSON.parse(line.substring(5).trim());
//                   let responseToken =
//                     dataSources.current.length === 0
//                       ? responseJson.choices?.[0]?.delta?.content
//                       : responseJson.choices?.[0]?.messages?.[0]?.delta
//                           ?.content;
//                   if (responseToken) {
//                     if (byodDocRegex.test(responseToken)) {
//                       responseToken = responseToken
//                         .replace(byodDocRegex, "")
//                         .trim();
//                     }
//                     if (responseToken === "[DONE]") responseToken = undefined;
//                   }
//                   if (responseToken) {
//                     assistantReply += responseToken;
//                     displaySentence += responseToken;
//                     spokenSentence += responseToken;
//                     if (responseToken === "\n" || responseToken === "\n\n") {
//                       speak(spokenSentence);
//                       spokenSentence = "";
//                     } else {
//                       responseToken = responseToken.replace(/\n/g, "");
//                       if (
//                         responseToken.length === 1 ||
//                         responseToken.length === 2
//                       ) {
//                         for (const punctuation of sentenceLevelPunctuations) {
//                           if (responseToken.startsWith(punctuation)) {
//                             speak(spokenSentence);
//                             spokenSentence = "";
//                             break;
//                           }
//                         }
//                       }
//                     }
//                   }

//                   if (!enableDisplayTextAlignmentWithSpeech) {
//                     setAssistantMessages(
//                       (prev) =>
//                         `${prev}<div class="flex justify-end bg-red-200 mb-2"><div class=" bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${displaySentence.replace(
//                           /\n/g,
//                           "<br/>"
//                         )}</div></div>`
//                     );
//                     // Chat Histroy
//                     setChatHistory(
//                       (prev) =>
//                         `${prev}<div class="flex justify-end bg-red-200 mb-2"><div class=" bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md text-base sm:text-lg leading-relaxed max-w-[80%]">${displaySentence.replace(
//                           /\n/g,
//                           "<br/>"
//                         )}</div></div>`
//                     );

//                     const assistantMessagesDiv =
//                       document.getElementById("assistantMessages");
//                     if (assistantMessagesDiv)
//                       assistantMessagesDiv.scrollTop = 0;
//                     displaySentence = "";
//                   }
//                 } catch (error) {
//                   console.error(
//                     `Error parsing response: ${error}, chunk: ${line}`
//                   );
//                   setErrorMessage("Error processing API response.");
//                 }
//               }
//             });
//             return read();
//           });
//         };
//         setAssistantMessages((prev) => `${prev}`);
//         // Chat Histroy
//         setChatHistory((prev) => `${prev}`);
//         return read();
//       })
//       .catch((error) => {
//         console.error(`Fetch error: ${error}`);
//         setErrorMessage("Failed to connect to OpenAI API.");
//       });
//   },
//   [openAIConfig, isSpeaking, stopSpeaking, speak, enableOyd]
// );
