"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartNew = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create case");
      }

      const { caseId, resumeToken } = await response.json();
      router.push(`/questionnaire/${caseId}?token=${resumeToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#374B46]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            O-1 Visa Case Builder
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We&apos;ll guide you step-by-step through collecting evidence for your
            O-1 visa application.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#2a3a36] rounded-2xl shadow-xl p-8 mb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Start New */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">
              Ready to start?
            </h2>
            <p className="text-gray-300 mb-6">
              Begin building your O-1 case. You can save your
              progress at any time and resume later.
            </p>
            <Button
              size="lg"
              onClick={handleStartNew}
              isLoading={isCreating}
              className="px-8"
            >
              Start New Case
            </Button>
          </div>
        </div>

        {/* O-1 Info */}
        <div className="bg-[#2a3a36] rounded-xl p-6 shadow-md mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            What is the O-1 Visa?
          </h2>
          <p className="text-gray-300 mb-4">
            The O-1 visa is for individuals with{" "}
            <strong className="text-white">extraordinary ability</strong> in sciences, education,
            business, or athletics. To qualify, you must demonstrate evidence
            for at least <strong className="text-white">3 of 8 criteria</strong> defined by USCIS.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-medium text-white mb-2">The 8 Criteria:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>1. Nationally/internationally recognized awards</li>
                <li>2. Membership in distinguished organizations</li>
                <li>3. Published material in major professional media</li>
                <li>4. Judging the work of others in specialized field</li>
                <li>5. Original contributions of major significance</li>
                <li>6. Scholarly authorship</li>
                <li>7. Critical employment at distinguished organizations</li>
                <li>8. High remuneration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">What We Collect:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Your basic information</li>
                <li>• Context about your achievements</li>
                <li>• Evidence to support your case strategy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <InfoCard
            title="Step-by-Step Guidance"
            description="We break down the complex O-1 requirements into manageable steps, explaining what's needed at each stage."
          />
          <InfoCard
            title="Save Your Progress"
            description="Don't have all your documents ready? Save your progress and come back anytime with your unique link."
          />
          <InfoCard
            title="Evidence Tips"
            description="Get guidance on what makes strong evidence for each criterion, with examples of what USCIS is looking for."
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <div className="bg-[#2a3a36] rounded-xl p-6 shadow-md">
      {icon && <div className="text-3xl mb-3">{icon}</div>}
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
}
