import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaCheckCircle, FaFileAlt, FaCalendarCheck, FaLaptop, FaUserCheck } from "react-icons/fa";

const onboardingSteps = [
  {
    id: 1,
    title: "Sign Joining Letter",
    // status: "Completed",
    status: "Current",
    description: "You’ve signed your joining letter and started your journey!",
    dueDate: "May 10, 2025",
    icon: <FaCheckCircle className="w-5 h-5" />,
    iconText: "Accepted",
    buttonText: "View Letter",
    action: "handleViewLetter",
  },
  {
    id: 2,
    title: "Add Documents",
    // status: "Current",
    status: "Upcoming",
    
    description: "Submit required documents to prepare for your start date.",
    dueDate: "May 11, 2025",
    icon: <FaFileAlt className="w-5 h-5" />,
    iconText: "Document Submission",
    buttonText: "View Documents",
    action: "handleViewDocuments",
  },
  {
    id: 3,
    title: "IT Setup",
    status: "Upcoming",
    // status: "Current",
    description: "Set up email account. Schedule welcome session.",
    dueDate: "May 12, 2025",
    icon: <FaLaptop className="w-5 h-5" />,
    iconText: "Pre-Joining Preparation",
    buttonText: "Begin Setup",
    action: "handleSetupPreparation",
  },
  {
    id: 4,
    title: "Meet your Team",
    status: "Upcoming",
    description: "Attend the orientation to meet your team and HR.",
    dueDate: "May 13, 2025",
    icon: <FaCalendarCheck className="w-5 h-5" />,
    iconText: "Orientation",
    buttonText: "View Agenda",
    action: "handleViewOrientation",
  },
  {
    id: 5,
    title: "Training",
    status: "Upcoming",
    description: "Receive your first project and get started.",
    dueDate: "May 14, 2025",
    icon: <FaUserCheck className="w-5 h-5" />,
    iconText: "First Week (Intergration)",
    buttonText: "View Assignment",
    action: "handleViewAssignment",
  },
  
  
];

const actions = {
  handleViewLetter: () => console.log("Viewing Letter"),
  handleViewDocuments: () => console.log("Viewing Documents"),
  handleSetupPreparation: () => console.log("Starting Setup"),
  handleViewOrientation: () => console.log("Viewing Orientation Agenda"),
  handleViewAssignment: () => console.log("Viewing Assignment"),
};

const OnboardingProcess = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Accordion 
      className="border border-[#D2D2D2]"
      style={{ borderRadius: '25px', borderWidth: '1px', boxShadow: 'none'  }}
      expanded={expanded} 
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className="w-full">
            <Typography
            sx={{ fontWeight: 600, fontSize: 20 }}
            className="text-left leading-[150%] tracking-[0%] px-4"
            >
            Welcome James! Your Onboarding Journey
            </Typography>
            
        </div>
    </AccordionSummary>

      <AccordionDetails>
        {/* Progress Bar */}
        <div
            className="w-full mb-4"
            style={{
                borderBottom: "2px solid #D2D2D2",
            }}
        ></div>
        <div className="flex items-center justify-between gap-4 px-32 pb-6">
            
          <div className="flex flex-1 items-center w-full justify-between">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex justify-center items-center">
                <div className="flex flex-col items-center ">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step.status === "Completed"
                        ? "bg-[#EDFFED] text-green-400"
                        : step.status === "Current"
                        ? "bg-green-100 text-green-400 border-2 border-dashed border-green-400 w-12 h-12"
                        : "bg-gray-100"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <h1 className="pt-2 font-semibold text-[16px] leading-[150%] tracking-[0%] text-center">
                    {step.iconText}
                  </h1>
                </div>
                {index < onboardingSteps.length - 1 && (
                  <svg
                    className="flex-1 w-40 h-1 mx-2 -translate-y-3"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke={
                        step.status === "Completed" ? "#44AA30" : "#C1BBB3"
                      }
                      strokeWidth="4"
                      strokeDasharray="8, 6"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Cards */}
        <div className="flex flex-row justify-between items-center gap-4 bg-gray-200 rounded-lg px-6 py-4">
          {onboardingSteps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-start text-semibold w-[28vh] min-h-[28vh] bg-[#FFFFFF] rounded-2xl p-4  ${
                step.status === "Completed"
                  ? "border-1 border-green-500"
                  : step.status === "Current"
                  ? "border-1 border-red-500"
                  : ""
              }`}
            >
              <h3 className="font-medium text-lg mx-2 mt-1">{step.title}</h3>
              <div
                className={`text-semibold text-sm text-center my-1.5 px-4 w-fit py-1 rounded-3xl ${
                  step.status === "Completed" || step.status === "Current"
                    ? "bg-[#EDFFED] text-[#44AA30] font-semibold"
                    : "bg-[#F1EFED] text-[#C1BBB3]"
                }`}
              >
                {step.status}
              </div>
              <p className="text-medium text-[#000000] m-2">
                {step.description}
              </p>
              <div className="text-xs text-gray-500 mt-2 mx-2">
                Due: {step.dueDate}
              </div>
              <button
                onClick={() => actions[step.action]?.()}
                disabled={step.status !== "Current"}
                className={`w-full mt-4 py-2 rounded-3xl font-normal  
                          ${
                            step.status === "Completed"
                              ? "bg-[#44AA30]/40 cursor-not-allowed text-white"
                              : ""
                          }
                          ${
                            step.status === "Current"
                              ? "bg-[#EB1700] hover:bg-red-600 text-white"
                              : ""
                          }
                          ${
                            step.status === "Upcoming"
                              ? "bg-[rgba(235,23,0,0.05)] text-[#EB1700] border-2 border-dotted border-red-700 cursor-not-allowed"
                              : ""
                          }
                      `}
              >
                {step.buttonText}
              </button>
            </div>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default OnboardingProcess;
