const verify = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dbdfe4] px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center border-none ring-1 ring-gray-200/50">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#3E4152] mb-3">
          Check Your Email
        </h2>
        <p className="text-[#7E818C] text-sm leading-relaxed">
          We've sent you an email to verify your account. Please check your
          inbox and click the verification link to continue.
        </p>
      </div>
    </div>
  );
};

export default verify;
