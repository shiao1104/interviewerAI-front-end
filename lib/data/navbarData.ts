import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Business, LockOpen, Work } from "@mui/icons-material";

const BASE_PATH = "/manage";

export const NavbarData = [
  { name: "公司資訊", path: `${BASE_PATH}`, icon: Business },
  { name: "問題管理", path: `${BASE_PATH}/questions`, icon: HelpOutlineIcon },
  // { name: "職位管理", path: `${BASE_PATH}/jobs`, icon: Work },
  { name: "職缺管理", path: `${BASE_PATH}/opening`, icon: LockOpen },
  {
    name: "面試者管理",
    path: `${BASE_PATH}/interviewee`,
    icon: AccountCircleIcon,
  },
];
