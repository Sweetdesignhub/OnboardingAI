"use client"

import { useState } from "react"
import { FaCheckCircle } from "react-icons/fa"         // CheckCircle
import { FaChevronUp } from "react-icons/fa"           // ChevronUp
import { FaTimes } from "react-icons/fa"               // X
import { FaFileAlt } from "react-icons/fa"             // FileText

export default function Dashboard() {
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  const colorClasses = {
    purple: "bg-purple-500",
    green: "bg-green-500",
    red: "bg-red-500",
  }
  
  const onboardingSteps = [
    {
      id: 1,
      title: "Offer Acceptance",
      status: "completed",
      icon: <FaCheckCircle className="w-5 h-5 text-green-500" />,
    },
    {
      id: 2,
      title: "Document Submission",
      status: "current",
      icon: <FaFileAlt className="w-5 h-5 text-green-500" />,
    },
    {
      id: 3,
      title: "Pre-Joining Preparation",
      status: "upcoming",
      icon: null,
    },
    {
      id: 4,
      title: "Orientation",
      status: "upcoming",
      icon: null,
    },
    {
      id: 5,
      title: "First Week (Intergration)",
      status: "upcoming",
      icon: null,
    },
  ]

  const tasks = [
    {
      id: 1,
      title: "Upload Government ID",
      status: "pending",
      description: "Upload a valid government-issued ID (e.g., ID Card, Passport) to verify your identity.",
      date: "May 10, 2025",
      color: "purple",
    },
    {
      id: 2,
      title: "Offer Letter Approval",
      status: "complete",
      description: "Review and digitally sign your offer letter to confirm your acceptance.",
      date: "May 10, 2025",
      color: "green",
    },
    {
      id: 3,
      title: "Complete Personal Details Form",
      status: "complete",
      description: "You've submitted your personal details (name, address, emergency contact).",
      date: "May 10, 2025",
      color: "green",
    },
  ]

  const quickLinks = [
    { id: 1, title: "Link 1", url: "#" },
    { id: 2, title: "Link 1", url: "#" },
    { id: 3, title: "Link 1", url: "#" },
    { id: 4, title: "Link 1", url: "#" },
  ]

  const documents = [
    { id: 1, title: "Pdf 1", url: "#" },
    { id: 2, title: "Pdf 1", url: "#" },
    { id: 3, title: "Pdf 1", url: "#" },
    { id: 4, title: "Pdf 1", url: "#" },
    { id: 5, title: "Pdf 1", url: "#" },
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Onboarding Journey Panel */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Welcome James! Your Onboarding Journey</h2>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            Close Panel
            <FaChevronUp className={`ml-2 w-5 h-5 transition-transform ${isPanelOpen ? "" : "rotate-180"}`} />
          </button>
        </div>

        {isPanelOpen && (
          <div className="p-6">
            {/* Progress Tracker */}
            <div className="flex justify-between items-center mb-8">
              {onboardingSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative">
                  {/* Connecting Line */}
                  {index < onboardingSteps.length - 1 && (
                    <div className="absolute top-4 w-full h-0.5 bg-gray-200 -right-1/2 z-0"></div>
                  )}

                  {/* Step Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 ${
                      step.status === "completed"
                        ? "bg-green-100 border-green-500 text-green-500"
                        : step.status === "current"
                          ? "bg-white border-green-500 text-green-500"
                          : "bg-white border-gray-300"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <FaCheckCircle className="w-5 h-5" />
                    ) : step.status === "current" ? (
                      step.icon
                    ) : null}
                  </div>

                  {/* Step Title */}
                  <span className="text-sm font-medium mt-2 text-center">{step.title}</span>
                </div>
              ))}
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Card 1: Sign Joining Letter */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-1">Sign Joining Letter</h3>
                <div className="text-xs text-green-600 font-medium mb-3">Complete</div>
                <p className="text-sm mb-4">You've signed your joining letter and started your journey!</p>
                <button className="w-full py-2 bg-green-200 text-green-800 rounded-md text-sm">Signed</button>
              </div>

              {/* Card 2: Add Documents */}
              <div className="bg-gray-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-medium mb-1">Add Documents</h3>
                <div className="text-xs text-orange-500 font-medium mb-3">In-Progress</div>
                <p className="text-sm mb-4">Submit required documents to prepare for your start date.</p>
                <button className="w-full py-2 bg-red-500 text-white rounded-md text-sm">Add Document</button>
              </div>

              {/* Card 3: IT Setup */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-1">IT Setup</h3>
                <div className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded mb-3">Upcoming</div>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Set up email account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Schedule welcome session</span>
                  </li>
                  <li className="text-xs text-gray-500 ml-4">(Due: May 12, 2025)</li>
                </ul>
                <button className="w-full py-2 border border-red-300 text-red-500 rounded-md text-sm">Setup</button>
              </div>

              {/* Card 4: Meet your Team */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-1">Meet your Team</h3>
                <div className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded mb-3">Upcoming</div>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Attend orientation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Complete compliance training</span>
                  </li>
                  <li className="text-xs text-gray-500 ml-4">(Start Date: May 15, 2025)</li>
                </ul>
                <button className="w-full py-2 border border-red-300 text-red-500 rounded-md text-sm">Join</button>
              </div>

              {/* Card 5: Training */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-1">Training</h3>
                <div className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded mb-3">Upcoming</div>
                <p className="text-sm mb-4">Start training and connect with your team.</p>
                <button className="w-full py-2 border border-red-300 text-red-500 rounded-md text-sm">
                  Start Training
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task List and Articles Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Task List</h2>
          </div>
          <div className="divide-y">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 relative">
<div className={`absolute left-0 top-0 bottom-0 w-1 ${colorClasses[task.color]}`}></div>
                <div className="flex justify-between">
                  <div className="pl-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{task.title}</h3>
                      {task.status === "pending" && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Pending</span>
                      )}
                      {task.status === "complete" && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">Complete</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    {task.status === "pending" && (
                      <button className="mt-3 px-4 py-1.5 bg-red-500 text-white text-sm rounded-md">Upload</button>
                    )}
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-sm text-gray-500">{task.date}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Articles</h2>
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-3">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {quickLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-gray-400 text-xs">www</span>
                  </div>
                  <span className="text-sm text-blue-500">{link.title}</span>
                </a>
              ))}
            </div>

            <h3 className="font-medium mb-3">Documents</h3>
            <div className="grid grid-cols-2 gap-3">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-red-500 text-xs">PDF</span>
                  </div>
                  <span className="text-sm text-blue-500">{doc.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
