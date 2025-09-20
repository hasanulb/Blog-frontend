import {
    LuLayoutDashboard,
    LuUsers,
    LuSquarePlus,
    LuLogOut,
    LuClipboardCheck,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/admin/dashboard",
    },
    {
        id: "02",
        label: "Manage Posts",
        icon: LuClipboardCheck,
        path: "/admin/posts",
    },
    {
        id: "03",
        label: "Create Post",
        icon: LuSquarePlus,
        path: "/admin/create-post",
    },
    {
        id: "04",
        label: "Users",
        icon: LuUsers,
        path: "/admin/users",
    },
    {
        id: "05",
        label: "LogOut",
        icon: LuLogOut,
        path: "logout",
    },
];

export const SIDE_MENU_USER_DATA = [
     {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/user/dashboard",
    },
    {
        id: "03",
        label: "Create Post",
        icon: LuSquarePlus,
        path: "/user/create-post",
    },
    {
        id: "02",
        label: "My Posts",
        icon: LuClipboardCheck,
        path: "/user/posts",
    },
    {
        id: "03",
        label: "LogOut",
        icon: LuLogOut,
        path: "logout",
    },
];
    
export const PRIORITY_DATA = [
    { label: "Low" , value: "Low" },
    { label: "Medium" , value: "Medium" },
    { label: "High" , value: "High" },
];

export const STATUS_DATA = [
    { label: "Pending" , value: "Pending" },
    { label: "In Progress" , value: "In Progress" },
    { label: "Completed" , value: "Completed" },
];

