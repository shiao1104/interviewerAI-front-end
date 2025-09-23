export const DEPARTMENTS = [
  "會計資訊系",
  "財務金融系",
  "資訊管理系",
  "財政稅務系",
  "應用外語系",
  "國際商務系",
  "企業管理系",
] as const;

export type Department = typeof DEPARTMENTS[number];

export type Question = { id: string; text: string; prepSec?: number; answerSec?: number };

export const SAMPLE_QUESTIONS: Record<Department, Question[]> = Object.fromEntries(
  DEPARTMENTS.map((d) => [
    d,
    [
      { id: "q1", text: "請做一下自我介紹，並說明為何選擇本系？", prepSec: 30, answerSec: 90 },
      { id: "q2", text: "分享一個與本系相關的經驗或專題。", prepSec: 30, answerSec: 90 },
      { id: "q3", text: "遇到困難時，你是如何解決問題的？", prepSec: 30, answerSec: 90 },
    ],
  ])
) as any;
