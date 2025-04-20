// 模擬數據
export const upcomingInterviews = [
  {
    id: 1,
    company: "科技未來有限公司",
    position: "資深前端工程師",
    date: "2025/04/10",
    time: "14:30-15:30",
    logo: "/company-logo-1.png",
  },
  {
    id: 2,
    company: "數位創新科技",
    position: "UI/UX 設計師",
    date: "2025/04/15",
    time: "10:00-11:00",
    logo: "/company-logo-2.png",
  },
];

export const completedInterviews = [
  {
    id: 3,
    company: "網路應用服務",
    position: "全端工程師",
    date: "2025/03/28",
    feedback: true,
  },
  {
    id: 4,
    company: "雲端系統開發",
    position: "系統架構師",
    date: "2025/03/20",
    feedback: true,
  },
];

export const notificationItems = [
  {
    id: 1,
    title: "面試確認通知",
    description: "您與「科技未來有限公司」的面試已確認",
    time: "1小時前",
    read: false,
  },
  {
    id: 2,
    title: "面試回饋已送達",
    description: "「網路應用服務」已提供您面試回饋",
    time: "1天前",
    read: false,
  },
  {
    id: 3,
    title: "系統更新通知",
    description: "系統已更新模擬面試功能，包含更多行業問題",
    time: "2天前",
    read: false,
  },
];

export const mockInterviewQuestions = [
  {
    id: 1,
    question: "請介紹一下你自己以及你過去的工作經驗。",
    timeLimit: 120, // 秒
    category: "自我介紹",
  },
  {
    id: 2,
    question: "描述一個你在前端開發中遇到的技術挑戰，以及你如何解決它？",
    timeLimit: 180,
    category: "技術能力",
  },
  {
    id: 3,
    question: "你如何看待前端框架React與Vue的差異？你更偏好哪一個？為什麼？",
    timeLimit: 150,
    category: "技術見解",
  },
  {
    id: 4,
    question: "請描述你參與過的一個團隊專案，以及你在其中所扮演的角色？",
    timeLimit: 180,
    category: "團隊合作",
  },
  {
    id: 5,
    question: "你認為優秀的前端工程師應該具備哪些特質？",
    timeLimit: 120,
    category: "職業觀點",
  },
];