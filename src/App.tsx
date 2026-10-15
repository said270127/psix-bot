import { useState } from "react";
import type { AgeCategory, TestResult } from "@/types";
import { kindergartenQuestions } from "@/data/kindergartenQuestions";
import { childQuestions } from "@/data/childQuestions";
import { teenQuestions } from "@/data/teenQuestions";
import { adultQuestions } from "@/data/adultQuestions";
import {
  getTestType,
  calculateScore,
  calculateKindergartenResult,
  calculateChildResult,
  calculateTeenResult,
  calculateAdultResult,
} from "@/lib/scoring";
import AgeSelection from "@/components/AgeSelection";
import Registration from "@/components/Registration";
import TestScreen from "@/components/TestScreen";
import ResultScreen from "@/components/ResultScreen";

type Screen = "age" | "registration" | "test" | "result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("age");
  const [ageCategory, setAgeCategory] = useState<AgeCategory>("3-7");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [maxScore, setMaxScore] = useState(0);

  function handleAgeSelect(category: AgeCategory) {
    setAgeCategory(category);
    setScreen("registration");
  }

  function handleRegistrationStart(fn: string, ln: string, p: string) {
    setFirstName(fn);
    setLastName(ln);
    setPhone(p);
    setScreen("test");
  }

  async function handleTestComplete(answers: { questionId: number; selectedIndex: number }[]) {
    const questions =
      ageCategory === "3-7"
        ? kindergartenQuestions
        : ageCategory === "8-13"
          ? childQuestions
          : ageCategory === "14-17"
            ? teenQuestions
            : adultQuestions;
    const options = questions.map((q) => q.options);
    const score = calculateScore(
      answers.map((a) => ({ selectedIndex: a.selectedIndex })),
      options,
    );
    const max = questions.length * 2;
    setMaxScore(max);

    let resultData: { result: string; interpretation: TestResult["interpretation"]; parts?: TestResult["parts"] };

    if (ageCategory === "3-7") {
      const kg = calculateKindergartenResult(answers.map((a) => ({ selectedIndex: a.selectedIndex })));
      resultData = { result: kg.result, interpretation: kg.interpretation, parts: kg.parts };
    } else if (ageCategory === "8-13") {
      resultData = calculateChildResult(score, max);
    } else if (ageCategory === "14-17") {
      resultData = calculateTeenResult(score, max);
    } else {
      resultData = calculateAdultResult(score, max);
    }

    const { result, interpretation, parts } = resultData;

    const testType = getTestType(ageCategory);
    const fullName = `${firstName} ${lastName}`;

    const completedAt = new Date().toISOString();

    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phoneNumber: phone,
          ageCategory,
          testType,
          score,
          maxScore: max,
          result,
          interpretation,
          parts: parts ?? undefined,
          completedAt,
        }),
      });
      if (!res.ok) {
        console.error("Telegram'ga yuborishda xatolik:", res.status);
      }
    } catch (err) {
      console.error("Telegram'ga yuborishda xatolik:", err);
    }

    setTestResult({
      fullName,
      phoneNumber: phone,
      ageCategory,
      testType,
      answers,
      score,
      result,
      interpretation,
      parts: parts ?? undefined,
      completedAt,
    });
    setScreen("result");
  }

  function handleRestart() {
    setScreen("age");
    setFirstName("");
    setLastName("");
    setPhone("");
    setTestResult(null);
    setMaxScore(0);
  }

  if (screen === "registration") {
    return (
      <Registration
        ageCategory={ageCategory}
        onBack={() => setScreen("age")}
        onStart={handleRegistrationStart}
      />
    );
  }

  if (screen === "test") {
    const questions =
      ageCategory === "3-7"
        ? kindergartenQuestions
        : ageCategory === "8-13"
          ? childQuestions
          : ageCategory === "14-17"
            ? teenQuestions
            : adultQuestions;
    return (
      <TestScreen
        questions={questions}
        onComplete={handleTestComplete}
        ageCategory={ageCategory}
      />
    );
  }

  if (screen === "result" && testResult) {
    return <ResultScreen result={testResult} maxScore={maxScore} onRestart={handleRestart} />;
  }

  return <AgeSelection onSelect={handleAgeSelect} />;
}
