export type OpeningTypes = {
  id: number;
  openingTitle: string; // 新增：職缺名稱
  headCount: number;    // 新增：需求人數
  status: string;       // 新增：職缺狀態，例如：招募中、已結束
  salaryRange: string;
  workLocation: string;
  jobType: string;
  educationRequirement: string;
  departmentRequirement: string;
  experienceRequirement: string;
  languageRequirement: string;
  workNature: string;
  workHours: string[];
  skills: string[];
  leavePolicy: string;
  jobDescription: string;
  contactInfo: string;
  createDate: string;
  vaild: boolean;
};
