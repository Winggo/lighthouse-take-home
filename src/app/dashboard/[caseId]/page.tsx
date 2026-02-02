"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Case, CriteriaRecommendation } from "@/lib/schemas/case";
import { O1_CRITERIA, CriteriaConfig } from "@/lib/schemas/criteria";
import { Button } from "@/components/ui/Button";

function getCriteriaConfig(criteriaId: string): CriteriaConfig | undefined {
  return O1_CRITERIA.find((c) => c.id === criteriaId);
}

function getCriteriaStatus(
  criteriaId: string,
  completedCriteria: string[],
  evidenceData?: Record<string, any>
): "completed" | "in_progress" | "not_started" {
  // Check if completed
  if (completedCriteria.includes(criteriaId)) {
    return "completed";
  }

  // Check if has any evidence data
  const criteriaEvidence = evidenceData?.[criteriaId];
  if (!criteriaEvidence) {
    return "not_started";
  }

  // Check if any field has data
  const hasAnyData = Object.values(criteriaEvidence).some((value) => {
    if (Array.isArray(value)) {
      // For arrays (like URLs), check if any non-empty string exists
      return value.some((item) => item && String(item).trim() !== "");
    }
    // For other values, check if non-empty
    return value !== null && value !== undefined && String(value).trim() !== "";
  });

  return hasAnyData ? "in_progress" : "not_started";
}

interface CriteriaSectionProps {
  recommendation: CriteriaRecommendation;
  criteriaConfig: CriteriaConfig;
  status: "completed" | "in_progress" | "not_started";
  onClick: () => void;
}

function CriteriaSection({
  recommendation,
  criteriaConfig,
  status,
  onClick,
}: CriteriaSectionProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-6 rounded-xl border-2 transition-all
        hover:shadow-lg hover:border-gray-300
        bg-[#2a3a36] border-gray-700
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Header with name and status */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-white">
              {criteriaConfig.name}
            </h3>
            {status === "completed" ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Completed
              </span>
            ) : status === "in_progress" ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                In Progress
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                Not started
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-300 mb-3">{criteriaConfig.shortDescription}</p>

          {/* AI Reasoning */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-800">
              <span className="font-medium">AI Analysis: </span>
              {recommendation.reasoning}
            </p>
          </div>

          {/* Evidence required */}
          <div className="text-sm text-gray-300">
            <span className="font-medium">Evidence needed: </span>
            {criteriaConfig.fields.filter((f) => f.required).length} required
            fields
          </div>
        </div>

        {/* Score */}
        <div className="text-center shrink-0">
          <div
            className={`
            text-3xl font-bold
            ${recommendation.score >= 70 ? "text-green-600" : ""}
            ${recommendation.score >= 40 && recommendation.score < 70 ? "text-yellow-600" : ""}
            ${recommendation.score < 40 ? "text-red-600" : ""}
          `}
          >
            {recommendation.score}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Match Score</div>
        </div>
      </div>

      {/* Click hint */}
      <div className="mt-4 flex items-center text-gray-400 text-sm font-medium">
        {status === "completed"
          ? "View submitted evidence"
          : status === "in_progress"
            ? "Continue collecting evidence"
            : "Start collecting evidence"}
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = params.caseId as string;
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        // If still in questionnaire, redirect back
        if (data.status === "questionnaire_in_progress") {
          router.push(`/questionnaire/${caseId}?token=${token}`);
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
  }, [caseId, router, token]);

  const handleCriteriaClick = (criteriaId: string) => {
    router.push(`/evidence/${caseId}/${criteriaId}?token=${token}`);
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "submitted",
          submittedAt: new Date().toISOString(),
        }),
      });

      // Refresh case data
      const res = await fetch(`/api/cases/${caseId}`);
      const data = await res.json();
      setCaseData(data);
    } catch (err) {
      console.error("Failed to submit application:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#374B46] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600" />
      </div>
    );
  }

  if (!caseData || caseData.recommendedCriteria.length === 0) {
    return (
      <div className="min-h-screen bg-[#374B46] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No recommendations found</p>
          <Button onClick={() => router.push("/")}>Start Over</Button>
        </div>
      </div>
    );
  }

  const allComplete =
    caseData.completedCriteria.length >= caseData.recommendedCriteria.length;
  const isSubmitted = caseData.status === "submitted";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-[#2a3a36] border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white">
            Your O-1 Case Strategy
          </h1>
          <p className="text-gray-300 mt-1">
            Based on your profile, we recommend focusing on these 3 criteria
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {isSubmitted ? (
          <div className="bg-green-100 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-800">
                  Application Submitted
                </h2>
                <p className="text-green-700">
                  Your O-1 case has been submitted successfully.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-100 border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Next Steps
                </h2>
                <p className="text-gray-700">
                  Click on each section below to submit your evidence. Once all
                  3 criteria are complete, you can submit your application.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#D97757] rounded-full h-2 transition-all duration-500"
              style={{
                width: `${(caseData.completedCriteria.length / caseData.recommendedCriteria.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-300 shrink-0">
            {caseData.completedCriteria.length} of{" "}
            {caseData.recommendedCriteria.length} complete
          </span>
        </div>

        {/* Criteria sections */}
        <div className="space-y-4">
          {caseData.recommendedCriteria.map((recommendation) => {
            const criteriaConfig = getCriteriaConfig(recommendation.criteriaId);
            if (!criteriaConfig) return null;

            const status = getCriteriaStatus(
              recommendation.criteriaId,
              caseData.completedCriteria,
              caseData.evidenceData
            );

            return (
              <CriteriaSection
                key={recommendation.criteriaId}
                recommendation={recommendation}
                criteriaConfig={criteriaConfig}
                status={status}
                onClick={() => handleCriteriaClick(recommendation.criteriaId)}
              />
            );
          })}
        </div>

        {/* Action buttons */}
        {!isSubmitted && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const url = `${window.location.origin}/dashboard/${caseId}?token=${token}`;
                navigator.clipboard.writeText(url);
                alert("Draft saved. Link copied to clipboard.");
              }}
            >
              Save Draft
            </Button>
            <Button
              size="lg"
              onClick={handleSubmitApplication}
              disabled={!allComplete}
              isLoading={isSubmitting}
              className={!allComplete ? "opacity-50 cursor-not-allowed" : ""}
            >
              {allComplete
                ? "Submit Application"
                : `Complete all criteria to submit`}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
