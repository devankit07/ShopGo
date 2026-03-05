import React from "react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <img
        src="/icon.png"
        alt="SHOP-GO"
        className="h-16 w-auto object-contain animate-pulse"
      />
    </div>
  );
}
