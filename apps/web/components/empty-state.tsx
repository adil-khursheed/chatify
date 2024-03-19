import React from "react";

const EmptyState = () => {
  return (
    <div className="px-4 py-10 h-full flex justify-center items-center bg-white dark:bg-slate-800">
      <div className="text-center flex flex-col items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-violet-50">
          Select a chat or start a new conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
