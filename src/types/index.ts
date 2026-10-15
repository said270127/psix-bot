export type AgeCategory = "3-7" | "8-13" | "14-17" | "18+";

export type TestType =
  | "kindergarten_psychological_test"
  | "child_psychological_test"
  | "teen_psychological_test"
  | "adult_psychological_test";

export type AnswerOption = {
  label: string;
  score: number;
};

export type Question = {
  id: number;
  text: string;
  options: AnswerOption[];
};

export type KindergartenPart = {
  title: string;
  resultName: string;
  description: string;
  strengths: string[];
  recommendation: string;
};

export type TestResult = {
  fullName: string;
  phoneNumber: string;
  ageCategory: AgeCategory;
  testType: TestType;
  answers: { questionId: number; selectedIndex: number }[];
  score: number;
  result: string;
  interpretation: {
    description: string;
    strengths: string[];
    improvements: string[];
    recommendation: string;
  };
  parts?: KindergartenPart[];
  completedAt: string;
};
