
"use client"

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="my-2">
      <div className="flex space-x-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`relative px-4 py-2 text-sm font-medium ${
              activeTab === tab.label ? "text-primary" : "text-gray-500 hover:text-gray-700"
            } cursor-pointer focus:outline-none`}
            onClick={() => setActiveTab(tab.label)}
          >
            <div className="flex items-center gap-2">
              <span>{tab.label}</span>
              <span
                className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${
                  activeTab === tab.label ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </div>
            {activeTab === tab.label && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaskStatusTabs
