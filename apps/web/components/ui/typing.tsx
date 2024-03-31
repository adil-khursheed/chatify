import clsx from "clsx";
import React from "react";

const Typing = () => {
  return (
    <div
      className={clsx(
        "p-5 rounded-3xl bg-violet-200 dark:bg-slate-600 w-fit inline-flex gap-1.5"
      )}>
      <span className="animation1 mx-[0.5px] h-2 w-2 bg-violet-300 dark:bg-slate-700 rounded-full"></span>
      <span className="animation2 mx-[0.5px] h-2 w-2 bg-violet-300 dark:bg-slate-700 rounded-full"></span>
      <span className="animation3 mx-[0.5px] h-2 w-2 bg-violet-300 dark:bg-slate-700 rounded-full"></span>
    </div>
  );
};

export default Typing;
