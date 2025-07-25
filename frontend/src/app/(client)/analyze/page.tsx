"use client";
import { PestAnalysisForm } from "@/components/templates/pest-analysis-form";
import { withAuth } from "@/lib/auth/with-auth";

function Analyze() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PestAnalysisForm />
    </div>
  );
}

export default withAuth(Analyze);
