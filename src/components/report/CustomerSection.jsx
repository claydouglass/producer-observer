import React from "react";
import { Heart } from "lucide-react";

export default function CustomerSection({ selected }) {
  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 border border-rose-100">
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <Heart className="text-rose-500" size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your customers love you
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            People who buy {selected.name} spend{" "}
            <strong className="text-gray-900">2x more</strong> at our store than
            average. They visit{" "}
            <strong className="text-gray-900">more often</strong> and buy from{" "}
            <strong className="text-gray-900">more categories</strong>.
          </p>

          <div className="flex items-center gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {selected.customers}
              </div>
              <div className="text-gray-500">customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">2x</div>
              <div className="text-gray-500">more valuable</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">30%</div>
              <div className="text-gray-500">come back</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
