import {
  LuLayoutDashboard,
  LuUsers,
  LuSquarePlus,
  LuLogOut,
  LuClipboardCheck,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
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
    label: "All Blogs",
    icon: LuClipboardCheck,
    path: "/user/posts/all", 
  },
  {
    id: "02",
    label: "My Posts",
    icon: LuClipboardCheck,
    path: "/user/posts", 
  },
  {
    id: "03",
    label: "Profile",
    icon: LuLayoutDashboard,
    path: "/user/profile",
  },
  {
    id: "04",
    label: "Create Post",
    icon: LuSquarePlus,
    path: "/user/create-post",
  },
  {
    id: "05",
    label: "LogOut",
    icon: LuLogOut,
    path: "logout",
  },
];
