import React from "react";
import { FaPlay } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const trainings = [
  {
    id: 1,
    title: "Security Awareness Training",
    description:
      "Learn about company security practices, password management, phishing, and safe data handling.",
    duration: "45 mins",
    trainer: {
      name: "Floyd Miles",
      role: "Project Manager",
      title: "Training Assigner",
    },
    image: "/src/assets/frame1-bg.png",
    imageName: "bob",
  },
  {
    id: 2,
    title: "Diversity & Inclusion Training",
    description:
      "Understanding diversity, equity, and inclusion in the workplace",
    duration: "30 mins",
    trainer: {
      name: "Peter Jones",
      role: "Software Development Manager",
      title: "Training Assigner",
    },
    image: "/src/assets/frame2-bg.png",
    imageName: "floyd",
  },
  {
    id: 3,
    title: "IT Systems Orientation",
    description:
      "Guide to accessing and using company IT systems, email, and collaboration tools.",
    duration: "55 mins",
    trainer: {
      name: "Bob Simons",
      role: "Software Tester",
      title: "Training Assigner",
    },
    image: "/src/assets/frame3-bg.png",
    imageName: "joan",
  },
  {
    id: 4,
    title: "Design Thinking Fundamentals",
    description:
      "Introduction to design thinking, creative problem solving, and user-centered design",
    duration: "30 mins",
    trainer: {
      name: "Joan Smith",
      role: "Scrum Master",
      title: "Training Assigner",
    },
    image: "/src/assets/frame1-bg.png",
    imageName: "peter",
  },
  {
    id: 5,
    title: "Project Management Essentials",
    description:
      "Learn fundamental project management methodologies, tools, and best practices.",
    duration: "60 mins",
    trainer: {
      name: "Sarah Connor",
      role: "Senior Project Manager",
      title: "Training Assigner",
    },
    image: "/src/assets/frame2-bg.png",
    imageName: "joan",
  },
  {
    id: 6,
    title: "Agile Development Practices",
    description:
      "Understanding Agile principles, Scrum framework, and sprint planning.",
    duration: "45 mins",
    trainer: {
      name: "Mike Chen",
      role: "Agile Coach",
      title: "Training Assigner",
    },
    image: "/src/assets/frame3-bg.png",
    imageName: "peter",
  },
  {
    id: 7,
    title: "Data Privacy Compliance",
    description:
      "Overview of GDPR, CCPA, and other data protection regulations.",
    duration: "40 mins",
    trainer: {
      name: "Lisa Kumar",
      role: "Compliance Officer",
      title: "Training Assigner",
    },
    image: "/src/assets/frame1-bg.png",
    imageName: "floyd",
  },
  {
    id: 8,
    title: "Team Communication Skills",
    description:
      "Effective communication strategies for remote and in-person teams.",
    duration: "35 mins",
    trainer: {
      name: "David Park",
      role: "HR Manager",
      title: "Training Assigner",
    },
    image: "/src/assets/frame2-bg.png",
    imageName: "floyd",
  },
  {
    id: 9,
    title: "Code Review Best Practices",
    description:
      "Learn effective code review techniques and collaboration practices.",
    duration: "50 mins",
    trainer: {
      name: "Emma Wilson",
      role: "Lead Developer",
      title: "Training Assigner",
    },
    image: "/src/assets/frame3-bg.png",
    imageName: "floyd",
  },
  //   {
  //     id: 10,
  //     title: "Cloud Computing Fundamentals",
  //     description:
  //       "Introduction to cloud services, deployment models, and basic architecture.",
  //     duration: "55 mins",
  //     trainer: {
  //       name: "Alex Rodriguez",
  //       role: "Cloud Architect",
  //       title: "Training Assigner",
  //     },
  //     image: "/src/assets/frame1-bg.png",
  //   },
  //   {
  //     id: 11,
  //     title: "UI/UX Design Principles",
  //     description:
  //       "Understanding user interface design patterns and user experience principles.",
  //     duration: "45 mins",
  //     trainer: {
  //       name: "Nina Patel",
  //       role: "UX Designer",
  //       title: "Training Assigner",
  //     },
  //     image: "/src/assets/frame2-bg.png",
  //   },
  //   {
  //     id: 12,
  //     title: "DevOps Fundamentals",
  //     description: "Introduction to DevOps culture, practices, and common tools.",
  //     duration: "60 mins",
  //     trainer: {
  //       name: "Tom Anderson",
  //       role: "DevOps Engineer",
  //       title: "Training Assigner",
  //     },
  //     image: "/src/assets/frame3-bg.png",
  //   },
  //   {
  //     id: 13,
  //     title: "Time Management Skills",
  //     description:
  //       "Strategies for prioritization, scheduling, and productivity enhancement.",
  //     duration: "30 mins",
  //     trainer: {
  //       name: "Rachel Green",
  //       role: "Productivity Coach",
  //       title: "Training Assigner",
  //     },
  //     image: "/src/assets/frame1-bg.png",
  //   },
  //   {
  //     id: 14,
  //     title: "API Development Standards",
  //     description: "Best practices for designing and documenting RESTful APIs.",
  //     duration: "40 mins",
  //     trainer: {
  //       name: "James Zhang",
  //       role: "API Architect",
  //       title: "Training Assigner",
  //     },
  //     image: "/src/assets/frame2-bg.png",
  //   },
];

function TrainingCard({ training }) {
  return (
    <div className="w-[350px] h-[400px] bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm">
      <div className="relative h-[150px] w-full ">
        <img
          src={training.image}
          alt={training.title}
          className="w-full h-full object-cover "
        />
        <button className="absolute right-3 top-32 w-10 h-10 bg-[#EB1700] rounded-full flex items-center justify-center shadow-md">
          <FaPlay className="text-white ml-0.5 text-sm" />
        </button>
      </div>
      <div className="p-2.5 mx-2">
        <h3 className="text-medium font-semibold mb-1">{training.title}</h3>
        <p className="text-gray-600 text-xs mb-1 line-clamp-2">
          {training.description}
        </p>
        <p className="text-black text-bold text-xs mb-2">{training.duration}</p>

        {/* Start Training Button */}
        <div className="flex justify-center mb-3">
          <button className="w-[186px] h-8 bg-[#44AA30] text-white rounded-full px-10 text-sm font-medium hover:bg-[#3a9129] transition-colors">
            Start Training
          </button>
        </div>

        {/* Horizontal separator line */}
        <div className="w-full border-t border-gray-200 mb-3"></div>

        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center w-full">
            <img
              src={`./${training.imageName}.png`}
              className="w-7 h-7 rounded-full bg-gray-200 mr-2 object-contain"
            />
            <div>
              <div className="flex flex-row justify-center items-center">
                <p className="font-medium text-sm">{training.trainer.name}</p>
                <p className="font-medium text-xs text-[#3E3E59] px-2">
                  Training Assigner
                </p>
              </div>
              <p className="text-gray-500 text-[10px]">
                {training.trainer.role}
              </p>
            </div>
          </div>
          <button className="flex justify-center items-center w-40 h-6 my-4 text-gray-600 border-1 border-[#44AA30] rounded-full py-3 hover:bg-gray-50">
            <img
              src="./SayHi.png"
              alt="SayHi"
              className="w-[30px] -translate-x-2 h-[29px] rotate-[-37deg]"
            />
            <span className="font-bold text-[12px] leading-[110%] tracking-[0%] text-center align-middle font-[Arial] ">
              Say Hi
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Training() {
  return (
    <div className="min-h-screen bg-white px-8 pb-8">
      <div className="w-full max-w-[1648px] min-h-[945px] mx-auto mt-[40px] relative border border-gray-200 rounded-[25px] bg-white">
        {/* Header section with proper padding and alignment */}
        <div className="px-8 pt-4 pb-4">
          <h1 className="text-2xl font-semibold">My Trainings</h1>
        </div>

        {/* Horizontal line with proper spacing */}
        <div className="w-full border-t border-gray-200"></div>

        {/* Container for the grid */}
        <div className="w-full mx-auto py-8 px-8">
          <div className="grid grid-cols-4 gap-6 justify-items-center">
            {trainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
