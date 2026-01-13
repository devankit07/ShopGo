import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setstatus] = useState("Verifying...");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setstatus("Email Verified Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setstatus("Verification failed. Please try again.");
    }
  };

  useEffect(() => {
    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dbdfe4] p-4">
      <div className="bg-white p-12 rounded-3xl text-center shadow-2xl w-full max-w-md border-none">
        <div className="inline-block p-4 rounded-full bg-pink-50 mb-6">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3F6C]" />
        </div>
        <h2 className="text-2xl font-bold text-[#3E4152] tracking-tight">
          {status}
        </h2>
        <p className="text-[#7E818C] mt-2 text-sm">
          Please do not close this window
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
