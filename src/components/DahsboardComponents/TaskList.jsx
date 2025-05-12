"use client"

import { FaTimes } from 'react-icons/fa';

const tasks = [
    {
      id: 1,
      title: "Upload Government ID",
      status: "pending",
      description: "Upload a valid government-issued ID (e.g., ID Card, Passport) to verify your identity.",
      date: "May 10, 2025",
      color: "purple",
      buttonText: "Upload Document",
      action: "handleUploadDocument"
    },
    {
      id: 2,
      title: "Offer Letter Approval",
      status: "complete",
      description: "Review and digitally sign your offer letter to confirm your acceptance.",
      date: "May 10, 2025",
      color: "green",
      buttonText: "Upload Offer Letter",
      action: "handleUploadDocument"
    },
    {
      id: 3,
      title: "Complete Personal Details Form",
      status: "complete",
      description: "You've submitted your personal details (name, address, emergency contact).",
      date: "May 10, 2025",
      color: "green",
      buttonText: "Upload Personal Details",
      action: "handleUploadDocument"
    },
  ];

const actions = {
  handleUploadDocument: () => console.log("Upload Document Function"),
  handleViewDocuments: () => console.log("Viewing Documents"),
  handleSetupPreparation: () => console.log("Starting Setup"),
  handleViewOrientation: () => console.log("Viewing Orientation Agenda"),
  handleViewAssignment: () => console.log("Viewing Assignment"),
};

export default function TaskList() {
  const handleRemoveTask = (id) => {
    console.log(`Remove task with id: ${id}`);
    // Implement task removal logic here
  };


  return (
    <div className="bg-white mx-8 mb-10 p-4 border-1 border-[#D2D2D2] rounded-3xl shadow-md overflow-hidden">
      <div className="pt-2 pl-4 pb-4">
        <h2 className="text-xl font-semibold">Task List</h2>
      </div>
      <div
            className="w-full mb-4"
            style={{
                borderBottom: "2px solid #D2D2D2",
            }}
        ></div>
      <div className="p-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 border-1 border-[#D9D9D9] relative my-4 rounded-xl">
            {/* Colored bar on the left */}
            <div
              className={`absolute left-0 top-0 bottom-0 rounded-l-xl w-1 ${task.status === "pending" ? "bg-purple-500" : "bg-green-500"} pl-2`}
            ></div>

            <div className="flex justify-between">
              <div className="pl-4 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{task.title}</h3>
                  {task.status === "pending" && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-3xl">Pending</span>
                  )}
                  {task.status === "complete" && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-3xl">Complete</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>

                {/* Only render button for pending tasks */}
                {task.status === "pending" && (
                  <button
                  onClick={() => actions[task.action]?.()}
                    className="mt-3 px-4 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                  >
                    Upload
                  </button>
                )}
              </div>

              <div className="flex items-start gap-4">
                <span className="text-sm text-gray-500">{task.date}</span>
                <button
                  onClick={() => handleRemoveTask(task.id)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Remove task"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
