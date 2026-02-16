// components/common/ErrorPage.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import logo from "../../assets/logo.png";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-white h-screen">
      {/* Header */}
      <div className="flex-shrink-0 p-6 lg:p-8 border-b border-gray-100">
        <Link to="/">
          <img src={logo} alt="amber" className="h-9 w-auto" />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            {/* Error Icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#8B52FF] to-[#E05A6A] flex items-center justify-center shadow-lg shadow-[#8B52FF]/30 mb-8">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            {/* 404 Number */}
            <h1 className="text-8xl font-bold bg-gradient-to-r from-[#8B52FF] to-[#E05A6A] bg-clip-text text-transparent mb-4">
              404
            </h1>
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Page Not Found
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Sorry, the page you are looking for doesn't exist or may have been
              moved.
            </p>
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/")}
                className="w-full py-3.5 bg-gradient-to-r from-[#8B52FF] to-[#E05A6A] text-white font-semibold rounded-xl shadow-lg shadow-[#8B52FF]/25 hover:shadow-xl hover:shadow-[#8B52FF]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full py-3.5 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-[#8B52FF] hover:text-[#8B52FF] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
