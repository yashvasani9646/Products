export const dropdownWrapperClass = "relative";

export const selectTriggerClass = (hasError) =>
  `w-full appearance-none rounded-xl border bg-white px-3 py-2.5 pl-10 pr-11 text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors duration-200 ease-in-out placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 ${
    hasError
      ? "border-red-300 shadow-red-50/40 focus:border-red-500 focus:ring-red-100"
      : "border-slate-200 shadow-slate-100/80 focus:border-blue-500 focus:ring-blue-100"
  }`;

export const selectTriggerNoIconClass = (hasError) =>
  `w-full appearance-none rounded-xl border bg-white px-3 py-2.5 pl-3.5 pr-11 text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors duration-200 ease-in-out placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 ${
    hasError
      ? "border-red-300 shadow-red-50/40 focus:border-red-500 focus:ring-red-100"
      : "border-slate-200 shadow-slate-100/80 focus:border-blue-500 focus:ring-blue-100"
  }`;

export const selectDisabledClass =
  "disabled:cursor-not-allowed disabled:bg-slate-50/80 disabled:text-slate-400 disabled:shadow-none disabled:hover:border-slate-200";

export const selectIconClass =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400";

export const selectChevronClass =
  "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-200 group-focus-within:rotate-180";

export const filterSelectClass =
  "w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pl-3.5 pr-11 text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors duration-200 ease-in-out cursor-pointer hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-slate-100/80";
