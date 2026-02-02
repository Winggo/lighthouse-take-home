"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Case, EvidenceData } from "@/lib/schemas/case";
import { O1_CRITERIA, CriteriaConfig, FieldConfig } from "@/lib/schemas/criteria";
import { FieldRenderer } from "@/components/fields/FieldRenderer";
import { Button } from "@/components/ui/Button";

function getCriteriaConfig(criteriaId: string): CriteriaConfig | undefined {
  return O1_CRITERIA.find((c) => c.id === criteriaId);
}

export default function EvidencePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = params.caseId as string;
  const criteriaId = params.criteriaId as string;
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [evidenceData, setEvidenceData] = useState<EvidenceData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const criteriaConfig = getCriteriaConfig(criteriaId);

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

        // Load existing evidence data if any
        if (data.evidenceData && data.evidenceData[criteriaId]) {
          setEvidenceData(data.evidenceData[criteriaId]);
        } else {
          // Initialize empty evidence data
          const initial: EvidenceData = {};
          criteriaConfig?.fields.forEach((field) => {
            initial[field.id] = field.type === "urls" ? [""] : null;
          });
          setEvidenceData(initial);
        }
      } catch (err) {
        console.error("Failed to load case:", err);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCase();
  }, [caseId, criteriaId, router, criteriaConfig]);

  const handleFieldChange = useCallback(
    (fieldId: string, value: string | string[]) => {
      setEvidenceData((prev) => ({
        ...prev,
        [fieldId]: value,
      }));
      // Clear error when user types
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    if (!criteriaConfig) return false;

    const newErrors: Record<string, string> = {};

    criteriaConfig.fields.forEach((field) => {
      if (field.required) {
        const value = evidenceData[field.id];

        if (field.type === "urls") {
          const urls = value as string[] | null;
          if (!urls || urls.length === 0 || urls.every((u) => !u.trim())) {
            newErrors[field.id] = "At least one URL is required";
          }
        } else {
          if (!value || (typeof value === "string" && !value.trim())) {
            newErrors[field.id] = "This field is required";
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [criteriaConfig, evidenceData]);

  const handleSave = async (markComplete: boolean) => {
    if (markComplete && !validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Prepare the update
      const updatedEvidenceData = {
        ...caseData?.evidenceData,
        [criteriaId]: evidenceData,
      };

      const existingCriteria = caseData?.completedCriteria || [];
      const updatedCompletedCriteria = markComplete
        ? existingCriteria.includes(criteriaId)
          ? existingCriteria
          : [...existingCriteria, criteriaId]
        : existingCriteria;

      await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidenceData: updatedEvidenceData,
          completedCriteria: updatedCompletedCriteria,
        }),
      });

      // Redirect back to dashboard
      router.push(`/dashboard/${caseId}?token=${token}`);
    } catch (err) {
      console.error("Failed to save evidence:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600" />
      </div>
    );
  }

  if (!criteriaConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Criteria not found</p>
          <Button onClick={() => router.push(`/dashboard/${caseId}?token=${token}`)}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isAlreadyComplete = caseData?.completedCriteria.includes(criteriaId);

  return (
    <div className="min-h-screen bg-[#374B46]">
      {/* Header */}
      <header className="bg-[#2a3a36] border-b border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push(`/dashboard/${caseId}?token=${token}`)}
            className="flex items-center text-gray-300 hover:text-white mb-4"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white">
            {criteriaConfig.name}
          </h1>
          <p className="text-gray-300 mt-1">{criteriaConfig.fullDescription}</p>
        </div>
      </header>

      {/* Help text */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-600 mt-0.5 shrink-0"
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
            <div>
              <h3 className="font-medium text-gray-800">Tips for Strong Evidence</h3>
              <p className="text-gray-700 text-sm mt-1">{criteriaConfig.helpText}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#2a3a36] rounded-xl shadow-sm border border-gray-700 p-6">
          <div className="space-y-6">
            {criteriaConfig.fields.map((field: FieldConfig) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={evidenceData[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
                error={errors[field.id]}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              isLoading={isSaving}
              disabled={isSaving}
            >
              {isAlreadyComplete ? "Update & Complete" : "Submit Evidence"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
