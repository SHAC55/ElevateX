// SkillContent.jsx
import React from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faExclamationTriangle, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import PremiumContentRenderer from "./PremiumContentRenderer";

export default function SkillContent({ loadingAI, aiError, aiMaterial, onRetry }) {
  if (loadingAI) {
    return (
      <Card variant="elevated" className="border-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        {/* skeleton, unchanged */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="h-6 w-40 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full animate-pulse"></div>
            <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-blue-600 animate-spin"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full animate-pulse"></div>
            <div className="h-4 w-4/5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full animate-pulse"></div>
            <div className="h-4 w-full bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full animate-pulse"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (aiError) {
    return (
      <Card variant="elevated" className="border-0 bg-gradient-to-br from-rose-50/80 to-rose-100/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-rose-700">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 mr-2" />
              <span className="font-medium">Content Unavailable</span>
            </div>
            {onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="rounded-full border-rose-300 text-rose-700 hover:bg-rose-50 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faSyncAlt} className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
          <div className="text-rose-800">
            <p className="text-rose-700/90 text-sm">
              {aiError?.response?.data?.message || aiError.message || "An unexpected error occurred while generating content"}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!aiMaterial) {
    return (
      <Card variant="elevated" className="border-0 bg-gradient-to-br from-gray-50 to-gray-100/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 text-center">
          <FontAwesomeIcon icon={faBookOpen} className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            Select a skill to view detailed learning content.
          </p>
        </div>
      </Card>
    );
  }

  // Expect the server shape shown above
  const material = aiMaterial.material || aiMaterial; // in case caller passed just {material:...}
  const json = material?.json || null;
  const text = material?.text || "";

  return (
    <Card variant="elevated" className="border-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-8">
        <PremiumContentRenderer json={json} fallbackText={text} />
      </div>
    </Card>
  );
}
