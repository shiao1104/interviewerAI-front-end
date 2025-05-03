import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BASE_PATH = "/manage";

export const NavbarData = [
  { name: "公司資訊", path: `${BASE_PATH}`, icon:  InfoOutlineIcon},
  { name: "問題列表", path: `${BASE_PATH}/questions`, icon:  HelpOutlineIcon },
  { name: "職缺資訊", path: `${BASE_PATH}/opening`, icon:  WorkIcon },
  { name: "面試者列表", path: `${BASE_PATH}/interviewee`, icon:  AccountCircleIcon },
];
