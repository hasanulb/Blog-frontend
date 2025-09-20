
"use client"

import { useEffect, useState, useCallback } from "react"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { LuUsers, LuRefreshCw } from "react-icons/lu"
import Modal from "../Modal"
import AvatarGroup from "../AvatarGroup"

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([])
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [tempSelectedUsers, setTempSelectedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  console.log("xxx", selectedUsers)

  // Use a memoized function to fetch users
  const getAllUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Use a shorter timeout for better UX
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS, {
        timeout: 8000, // 8 seconds timeout
      })

      if (response.data?.length > 0) {
        setAllUsers(response.data)
      } else {
        // Handle empty response
        setAllUsers([])
      }
    } catch (error) {
      console.error("Error fetching users", error)

      // Set a user-friendly error message based on the error type
      if (error.code === "ECONNABORTED") {
        setError("Request timed out. The server is taking too long to respond.")
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${error.response.status}`)
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.")
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An unexpected error occurred.")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const retryFetchUsers = () => {
    setRetryCount((prev) => prev + 1)
    getAllUsers()
  }

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers)
    setIsModelOpen(false)
  }

  // Get selected user avatars for display
  const selectedUserAvatars =
    selectedUsers.length > 0 && selectedUsers[0]._id
      ? selectedUsers.map((user) => user.profileImageUrl || "")
      : allUsers.filter((user) => selectedUsers.includes(user._id)).map((user) => user.profileImageUrl)

  // Initialize tempSelectedUsers when the modal opens
  const handleOpenModal = () => {
    // Handle both array of IDs and array of user objects
    const userIds =
      selectedUsers.length > 0 && selectedUsers[0]._id ? selectedUsers.map((user) => user._id) : selectedUsers

    setTempSelectedUsers(userIds)
    setIsModelOpen(true)

    // If we haven't loaded users yet or there was an error, try to load them
    if (allUsers.length === 0 || error) {
      getAllUsers()
    }
  }

  // Initial fetch on component mount
  useEffect(() => {
    getAllUsers()
  }, [getAllUsers])

  // Reset tempSelectedUsers when selectedUsers is cleared
  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([])
    }
    return () => {}
  }, [selectedUsers])

  // Render loading skeleton for users in the modal
  const renderLoadingSkeleton = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <div key={`skeleton-${index}`} className="flex items-center gap-4 p-3 border-b border-gray-200 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
        </div>
      ))
  }

  // Render error state in the modal
  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-full py-8">
      {/* <LuAlertCircle className="text-red-500 text-4xl mb-4" /> */}
      <p className="text-red-500 font-medium mb-2">Failed to load users</p>
      <p className="text-gray-500 text-sm text-center mb-4">{error}</p>
      <button className="card-btn flex items-center gap-2" onClick={retryFetchUsers} disabled={loading}>
        <LuRefreshCw className={`${loading ? "animate-spin" : ""}`} />
        {loading ? "Retrying..." : "Retry"}
      </button>
    </div>
  )

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 && (
        <button className="card-btn" onClick={handleOpenModal}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={handleOpenModal}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal isOpen={isModelOpen} onClose={() => setIsModelOpen(false)} title="Select Users">
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {loading && allUsers.length === 0 && renderLoadingSkeleton()}

          {!loading && error && renderError()}

          {!loading && !error && allUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <p className="text-gray-500">No users found.</p>
            </div>
          )}

          {!loading &&
            !error &&
            allUsers.length > 0 &&
            allUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <img
                  src={user.profileImageUrl || "/placeholder.svg"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                  <p className="text-[13px] text-gray-500">{user.email}</p>
                </div>

                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
                />
              </div>
            ))}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t mt-4">
          <button className="card-btn" onClick={() => setIsModelOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign} disabled={loading}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectUsers
