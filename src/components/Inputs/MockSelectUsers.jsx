"use client"

import { useEffect, useState } from "react"
import { LuUsers } from "react-icons/lu"
import Modal from "../Modal"
import AvatarGroup from "../AvatarGroup"

// Mock data for development/testing when API is unavailable
const MOCK_USERS = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    profileImageUrl: "https://ui-avatars.com/api/?name=John+Doe",
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    profileImageUrl: "https://ui-avatars.com/api/?name=Jane+Smith",
  },
  {
    _id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    profileImageUrl: "https://ui-avatars.com/api/?name=Robert+Johnson",
  },
  {
    _id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    profileImageUrl: "https://ui-avatars.com/api/?name=Emily+Davis",
  },
  {
    _id: "5",
    name: "Michael Wilson",
    email: "michael@example.com",
    profileImageUrl: "https://ui-avatars.com/api/?name=Michael+Wilson",
  },
]

const MockSelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers] = useState(MOCK_USERS)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [tempSelectedUsers, setTempSelectedUsers] = useState([])

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers)
    setIsModelOpen(false)
  }

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl)

  // Initialize tempSelectedUsers when the modal opens
  const handleOpenModal = () => {
    setTempSelectedUsers(selectedUsers)
    setIsModelOpen(true)
  }

  // Reset tempSelectedUsers when selectedUsers is cleared
  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([])
    }
    return () => {}
  }, [selectedUsers])

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

      <Modal isOpen={isModelOpen} onClose={() => setIsModelOpen(false)} title="Select Users (Mock)">
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <img
                src={user.profileImageUrl || "/placeholder.svg"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
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
          <button className="card-btn-fill" onClick={handleAssign}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default MockSelectUsers
