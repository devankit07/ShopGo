import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound({ inAdmin = false }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8 text-center">
        <p className="text-sm font-semibold text-[#FF3F6C]">404</p>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold text-[#3E4152]">Page not found</h1>
        <p className="mt-3 text-sm md:text-base text-gray-600">
          {inAdmin
            ? "This admin section does not exist. Please choose a valid admin option."
            : "The page you are trying to open does not exist or may have been moved."}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {inAdmin ? (
            <Button className="w-full sm:w-auto bg-[#FF3F6C] hover:bg-[#e0355f]" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          ) : (
            <Button className="w-full sm:w-auto bg-[#FF3F6C] hover:bg-[#e0355f]" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          )}

          <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
