"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { QuestionContainer } from "@/components/questionnaire/QuestionContainer";
import { TextQuestion } from "@/components/questionnaire/questions/TextQuestion";
import { NumberQuestion } from "@/components/questionnaire/questions/NumberQuestion";
import { YesNoQuestion } from "@/components/questionnaire/questions/YesNoQuestion";
import { MultiSelectQuestion } from "@/components/questionnaire/questions/MultiSelectQuestion";
import { SingleSelectQuestion } from "@/components/questionnaire/questions/SingleSelectQuestion";
import { Case, QuestionnaireResponses } from "@/lib/schemas/case";
import { QuestionConfig } from "@/lib/schemas/questionnaire";

export default function QuestionnairePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = params.caseId as string;
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [caseData, setCaseData] = useState<Case | null>(null);

  const {
    responses,
    currentIndex,
    currentQuestion,
    isSubmitting,
    error,
    direction,
    isLastQuestion,
    totalQuestions,
    setResponse,
    goNext,
    goPrev,
    setSubmitting,
    setError,
    loadCase,
  } = useQuestionnaire();

  // Load case data
  useEffect(() => {
    async function fetchCase() {
      try {
        const res = await fetch(`/api/cases/${caseId}`);
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data = await res.json();
        setCaseData(data);
        loadCase(data);

        // If questionnaire is complete, redirect to dashboard
        if (
          data.status === "questionnaire_complete" ||
          data.status === "evidence_in_progress" ||
          data.status === "submitted"
        ) {
          router.push(`/dashboard/${caseId}?token=${token}`);
          return;
        }
      } catch (err) {
        console.error("Failed to load case:", err);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCase();
  }, [caseId, router, token, loadCase]);

  // Save progress
  const saveProgress = useCallback(async () => {
    try {
      await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionnaireResponses: responses,
          currentQuestionIndex: currentIndex,
        }),
      });
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
  }, [caseId, responses, currentIndex]);

  // Handle next question
  const handleNext = useCallback(async () => {
    if (!goNext()) return;

    await saveProgress();

    // If this was the last question, submit to AI
    if (isLastQuestion) {
      setSubmitting(true);
      try {
        // First save with questionnaire complete status
        await fetch(`/api/cases/${caseId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionnaireResponses: responses,
            currentQuestionIndex: currentIndex + 1,
            status: "questionnaire_complete",
          }),
        });

        // Call AI to get recommendations
        const aiRes = await fetch("/api/ai/recommend-criteria", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId,
            responses,
          }),
        });

        if (!aiRes.ok) {
          throw new Error("Failed to get AI recommendations");
        }

        // Redirect to dashboard
        router.push(`/dashboard/${caseId}?token=${token}`);
      } catch (err) {
        console.error("Failed to submit questionnaire:", err);
        setError("Failed to process your responses. Please try again.");
        setSubmitting(false);
      }
    }
  }, [
    goNext,
    saveProgress,
    isLastQuestion,
    setSubmitting,
    caseId,
    responses,
    currentIndex,
    router,
    token,
    setError,
  ]);

  // Handle previous question
  const handlePrev = useCallback(() => {
    goPrev();
    saveProgress();
  }, [goPrev, saveProgress]);

  // Render question input based on type
  const renderQuestionInput = (question: QuestionConfig) => {
    const fieldId = question.id as keyof QuestionnaireResponses;

    switch (question.type) {
      case "text":
        return (
          <TextQuestion
            value={responses[fieldId] as string | null}
            onChange={(val) => setResponse(fieldId, val)}
            onSubmit={handleNext}
            placeholder={question.placeholder}
          />
        );

      case "textarea":
        return (
          <TextQuestion
            value={responses[fieldId] as string | null}
            onChange={(val) => setResponse(fieldId, val)}
            onSubmit={handleNext}
            placeholder={question.placeholder}
            multiline
          />
        );

      case "currency":
        return (
          <NumberQuestion
            value={responses[fieldId] as string | null}
            onChange={(val) => setResponse(fieldId, val)}
            onSubmit={handleNext}
            placeholder={question.placeholder}
            isCurrency
          />
        );

      case "number":
        return (
          <NumberQuestion
            value={responses[fieldId] as number | null}
            onChange={(val) => setResponse(fieldId, val)}
            onSubmit={handleNext}
            placeholder={question.placeholder}
          />
        );

      case "yes_no":
        return (
          <YesNoQuestion
            value={responses[fieldId] as boolean | null}
            onChange={(val) => setResponse(fieldId, val)}
            onSubmit={handleNext}
            followUpValue={
              question.followUpField
                ? (responses[question.followUpField] as string | null)
                : undefined
            }
            onFollowUpChange={
              question.followUpField
                ? (val) => setResponse(question.followUpField!, val)
                : undefined
            }
            followUpPlaceholder={question.followUpPlaceholder}
          />
        );

      case "multi_select":
        return (
          <MultiSelectQuestion
            value={responses[fieldId] as string[]}
            onChange={(val) => setResponse(fieldId, val)}
            onSubmit={handleNext}
            options={question.options || []}
          />
        );

      case "single_select":
        return (
          <SingleSelectQuestion
            value={responses[fieldId] as string | null}
            onChange={(val) => setResponse(fieldId, val)}
            onSubmit={handleNext}
            options={question.options || []}
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#374B46] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600" />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#374B46] flex items-center justify-center">
        <p className="text-gray-400">Question not found</p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[#374B46] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600" />
        <p className="text-xl text-gray-300">Analyzing your responses...</p>
        <p className="text-gray-400">
          Our AI is determining the best criteria for your case
        </p>
      </div>
    );
  }

  return (
    <QuestionContainer
      questionNumber={currentIndex + 1}
      totalQuestions={totalQuestions}
      question={currentQuestion.question}
      subtext={currentQuestion.subtext}
      error={error}
      direction={direction}
      onPrev={handlePrev}
      showPrev={currentIndex > 0}
    >
      {renderQuestionInput(currentQuestion)}
    </QuestionContainer>
  );
}
