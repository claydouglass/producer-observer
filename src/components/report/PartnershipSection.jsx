import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function PartnershipSection({ selected }) {
  const wholesale = selected.wholesale || 0;
  const potential = Math.round(wholesale * 1.84);

  return (
    <>
      {/* Next Steps */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          What to do next
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                Check your inventory
              </div>
              <div className="text-gray-600">
                If sales dropped, it might be a supply issue. Make sure your top
                sellers are in stock.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                Consider adding gummies
              </div>
              <div className="text-gray-600">
                Your customers already buy them - just from other brands.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <div className="font-semibold text-gray-900">Talk to us</div>
              <div className="text-gray-600">
                We want to help you win. Let's figure out the best plan
                together.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Big Picture */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-10 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          You could be doing ${Math.round(potential / 1000)}K
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-lg mx-auto">
          That's <strong>+84%</strong> more than today. Fill the gaps, stay in
          stock, and let's make it happen.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-4 bg-white text-green-600 rounded-2xl font-bold text-lg hover:bg-green-50 transition-colors flex items-center gap-2">
            Let's talk
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-green-200">
          <span className="flex items-center gap-2">
            <CheckCircle size={16} />
            Real-time data
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle size={16} />
            No commitment
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle size={16} />
            We're on your side
          </span>
        </div>
      </div>
    </>
  );
}
