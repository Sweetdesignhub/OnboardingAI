"use client"

import { useState } from "react"
import { FaCheckCircle } from "react-icons/fa"         // CheckCircle
import { FaChevronUp } from "react-icons/fa"           // ChevronUp
import { FaTimes } from "react-icons/fa"               // X
import { FaFileAlt } from "react-icons/fa"             // FileText
import Articles from "../components/DahsboardComponents/Articles"
import OnboardingProcess from "../components/DahsboardComponents/OnboardingProcess"
import TaskList from "../components/DahsboardComponents/TaskList"

export default function Dashboard() {
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  
 

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
    <div className="h-[85vh] flex flex-col">
        {/* Top Half */}
        <div className="flex-1 my-8 mx-8  rounded-2xl bg-[#FFFFFF]">
            <OnboardingProcess />
        </div>

        {/* Bottom Half */}
        <div className="flex-1 flex">
        <div className="w-1/2 ">
            <TaskList />
        </div>
        <div className="w-1/2 ">
            <Articles />
        </div>
        </div>
    </div>
  )
}
