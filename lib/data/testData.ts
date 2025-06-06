import { JobsTypes } from "../types/jobsTypes";
import { OpeningTypes } from "../types/openingTypes";

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

export const companyInfo = {
  name: "科技未來有限公司",
  logo: "科",
  industry: "資訊科技",
  location: "台北市信義區",
  size: "500-1000人",
  founded: "2010年",
  website: "www.example.com",
  description:
    "科技未來有限公司是一家專注於人工智能、雲端運算和大數據分析的科技公司。我們致力於開發創新解決方案，協助企業優化營運流程、提升效率並創造價值。通過前沿技術與行業專業知識的結合，我們為客戶提供定制化的服務，滿足其獨特需求。",
  culture:
    "我們擁有開放、創新的工作文化，鼓勵員工分享想法、勇於嘗試。我們重視團隊合作和持續學習，定期舉辦知識分享和培訓活動，協助員工成長和發展。我們提供彈性工作安排和舒適的工作環境，確保員工工作與生活的平衡。",
  benefits: [
    "彈性工作時間",
    "優質健康保險",
    "年度旅遊補助",
    "教育訓練津貼",
    "免費健身房",
    "股票選擇權",
  ],
  keyProjects: ["雲端數據分析平台", "智能客戶服務系統", "企業資源規劃解決方案"],
};

export const companyType = [
  { key: 1, value: "科技類" },
  { key: 2, value: "金融業" },
  { key: 3, value: "製造業" },
  { key: 4, value: "貿易/批發業" },
  { key: 5, value: "零售業" },
  { key: 6, value: "建築營造" },
  { key: 7, value: "運輸物流" },
  { key: 8, value: "餐飲服務業" },
  { key: 9, value: "旅遊觀光" },
  { key: 10, value: "醫療保健業" },
  { key: 11, value: "教育/訓練" },
  { key: 12, value: "法律服務" },
  { key: 13, value: "顧問/顧問服務" },
  { key: 14, value: "媒體/廣告/公關" },
];

export const questionsData = [
  {
    id: 1,
    position: "通用問題",
    type: "自我介紹",
    question: "請介紹一下你自己以及你過去的工作經驗",
    timeAllowed: "3分鐘",
    difficulty: "簡單",
    createDate: "2025/1/1",
    vaild: false,
  },
  {
    id: 2,
    position: "通用問題",
    type: "針對前端工程師職位",
    question: "請解釋你如何解決前端性能問題",
    timeAllowed: "5分鐘",
    difficulty: "中等",
    createDate: "2025/1/1",
    vaild: false,
  },
  {
    id: 3,
    position: "通用問題",
    type: "針對後端工程師職位",
    question: "談談你對資料庫優化的經驗",
    timeAllowed: "5分鐘",
    difficulty: "困難",
    createDate: "2025/1/1",
    vaild: false,
  },
  {
    id: 4,
    position: "通用問題",
    type: "團隊合作",
    question: "描述一個你在團隊中解決衝突的經驗",
    timeAllowed: "4分鐘",
    difficulty: "中等",
    createDate: "2025/1/1",
    vaild: true,
  },
  {
    id: 5,
    position: "通用問題",
    type: "問題解決能力",
    question: "分享一個你在工作中面臨的挑戰以及你如何解決它",
    timeAllowed: "6分鐘",
    difficulty: "困難",
    createDate: "2025/1/1",
    vaild: false,
  },
  {
    id: 5,
    position: "通用問題",
    type: "問題解決能力",
    question: "分享一個你在工作中面臨的挑戰以及你如何解決它",
    timeAllowed: "6分鐘",
    difficulty: "困難",
    createDate: "2025/1/1",
    vaild: false,
  },
];

export const intervieweeData = [
  {
    id: "A001",
    name: "王小明",
    type: "前端工程師",
    difficulty: "2025-05-15 14:00",
    createDate: "2025-05-10",
  },
  {
    id: "A002",
    name: "陳美麗",
    type: "資料分析師",
    difficulty: "已完成",
    createDate: "2025-05-11",
  },
  {
    id: "A003",
    name: "李大衛",
    type: "AI 模型訓練師",
    difficulty: "未到場",
    createDate: "2025-05-12",
  },
];

export const jobData: JobsTypes[] = [
  {
    id: 1,
    position: "前端工程師",
    salaryRange: "月薪 40,000~55,000 元",
    workLocation: "台北市信義區",
    jobType: "全職",
    educationRequirement: "大學",
    departmentRequirement: "資訊相關科系",
    experienceRequirement: "需1年以上相關經驗",
    languageRequirement: "英文中等以上",
    workNature: "內勤",
    workHours: ["彈性工時", "日班"],
    skills: ["React", "JavaScript", "CSS"],
    leavePolicy: "週休二日",
    jobDescription: "負責前端介面開發與優化，與設計與後端工程師協作。",
    contactInfo: "hr@innotech.com.tw",
    createDate: "2025/05/10",
  },
  {
    id: 2,
    position: "行銷專員",
    salaryRange: "月薪 35,000~45,000 元，依經驗可議",
    workLocation: "可遠端",
    jobType: "全職",
    educationRequirement: "專科",
    departmentRequirement: "",
    experienceRequirement: "無經驗可",
    languageRequirement: "中文精通",
    workNature: "外勤",
    workHours: ["日班"],
    skills: ["Excel", "Canva", "社群經營"],
    leavePolicy: "依公司規定",
    jobDescription: "負責社群貼文、品牌曝光與活動執行。",
    contactInfo: "apply@futuremarketing.com.tw",
    createDate: "2025/05/10",
  },
];

export const openingData: OpeningTypes[] = [
  {
    id: 1,
    openingTitle: "2025 暑期實習 - 前端工程師",
    headCount: 3,
    status: "招募中",
    salaryRange: "月薪 40,000~55,000 元",
    workLocation: "台北市信義區",
    jobType: "全職",
    educationRequirement: "大學",
    departmentRequirement: "資訊相關科系",
    experienceRequirement: "需1年以上相關經驗",
    languageRequirement: "英文中等以上",
    workNature: "辦公室內部作業",
    workHours: ["彈性工時", "日班"],
    skills: ["React", "TypeScript", "HTML", "CSS"],
    leavePolicy: "週休二日",
    jobDescription:
      "負責網站前端開發、與設計及後端工程師協作，打造良好使用者體驗。",
    contactInfo: "hr@techstart.com.tw",
    createDate: "2025/05/10",
    vaild: true,
  },
  {
    id: 2,
    openingTitle: "資深後端工程師職缺",
    headCount: 2,
    status: "已關閉",
    salaryRange: "月薪 60,000~80,000 元，依經驗可議",
    workLocation: "高雄市左營區",
    jobType: "全職",
    educationRequirement: "碩士",
    departmentRequirement: "不限",
    experienceRequirement: "需3年以上後端開發經驗",
    languageRequirement: "中文精通，英文中等",
    workNature: "系統設計與維護",
    workHours: ["日班"],
    skills: ["Node.js", "PostgreSQL", "Docker", "REST API"],
    leavePolicy: "依公司規定",
    jobDescription: "負責設計與維護公司核心 API，協助 DevOps 流程優化。",
    contactInfo: "recruit@backendpro.com.tw",
    createDate: "2025/05/15",
    vaild: false,
  },
];
