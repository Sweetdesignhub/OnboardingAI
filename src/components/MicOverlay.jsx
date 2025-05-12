import { useState, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function MicOverlay({
  isOpen,
  onClose,
  circleVideoSrc,
  voiceGifSrc,
}) {
  const [listening, setListening] = useState(false);
  const overlayRef = useRef(null);

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Toggle listening state
  const toggleListening = () => {
    setListening(!listening);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50">
      <div className="flex justify-center items-start h-full pt-8">
        <div
          ref={overlayRef}
          className="bg-white rounded-t-full w-full max-w-xl h-full overflow-hidden flex flex-col pt-10 px-4"
        >
          {/* Spacer to push video slightly down */}
          <div className="mt-8 flex justify-center">
            <div className="w-[22rem] h-[22rem] relative">
              <div className="w-full h-full rounded-full overflow-hidden">
                <video
                  src={circleVideoSrc}
                  className="w-full h-full rounded-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>

          {/* Growable spacer to push next content to the bottom */}
          <div className="flex-grow" />

          {/* Bottom content: gif + text */}
          <div className="flex flex-col items-center mb-30">
            <div className="w-20 h-20 mb-6">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={voiceGifSrc}
                  alt="Voice animation"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl">
                {listening ? (
                  "Listening..."
                ) : (
                  <>
                    <span className="block">
                      Tell me what you’d like to know or need
                    </span>
                    <span className="block">help with...</span>
                  </>
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
