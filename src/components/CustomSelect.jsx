import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ImageOff } from "lucide-react";

const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  disabled = false,
  hasError = false,
  icon: Icon = null,
  className = "",
  triggerClassName = "",
  name,
  ariaLabel,
  showImage = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const renderImage = (imageUrl, alt = "") => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={alt}
          className="h-6 w-6 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
          loading="lazy"
        />
      );
    }
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-300 ring-1 ring-slate-200">
        <ImageOff size={12} />
      </span>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const items = listRef.current?.querySelectorAll('[role="option"]');
      if (items && items.length > 0) {
        items[0].focus();
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const items = listRef.current?.querySelectorAll('[role="option"]');
      if (items && items.length > 0) {
        items[items.length - 1].focus();
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleOptionKeyDown = (e, optValue) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectOption(optValue);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const items = Array.from(listRef.current?.querySelectorAll('[role="option"]') || []);
      const idx = items.indexOf(e.currentTarget);
      const next = items[idx + 1] || items[0];
      next?.focus();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const items = Array.from(listRef.current?.querySelectorAll('[role="option"]') || []);
      const idx = items.indexOf(e.currentTarget);
      const prev = items[idx - 1] || items[items.length - 1];
      prev?.focus();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
    if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const selectOption = (optValue) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { value: optValue, name } });
    }
    setOpen(false);
    buttonRef.current?.focus();
  };
  const baseTrigger = `group relative w-full flex items-center text-left rounded-xl border bg-white px-3 py-2.5 text-sm font-medium shadow-sm outline-none transition-colors duration-200 ease-in-out ` +
    (disabled
      ? "cursor-not-allowed bg-slate-50/80 text-slate-400 shadow-none "
      : "cursor-pointer hover:border-slate-300 ") +
    (hasError
      ? "border-red-300 shadow-red-50/40 focus:border-red-500 focus:ring-4 focus:ring-red-100 "
      : "border-slate-200 shadow-slate-100/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ") +
    triggerClassName;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {Icon && (
        <Icon
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10"
        />
      )}
      <button
        ref={buttonRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={baseTrigger + (Icon ? " pl-10" : " pl-3.5") + " pr-11"}
      >
        <span
          className={`flex items-center gap-2 truncate ${
            selectedOption ? "text-slate-700" : "text-slate-400"
          }`}
        >
          {selectedOption && (showImage || selectedOption.image) && renderImage(selectedOption.image, selectedOption.label)}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
      </button>
      <ChevronDown
        size={16}
        className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />
      {open && !disabled && (
        <div
          ref={listRef}
          role="listbox"
          aria-labelledby={id}
          className="custom-select-list absolute left-0 right-0 top-[calc(100%+6px)] z-[100] max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5"
        >
          {options.length === 0 ? (
            <div className="px-3.5 py-2 text-sm text-slate-400">No options</div>
          ) : (
            options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => selectOption(opt.value)}
                  onKeyDown={(e) => handleOptionKeyDown(e, opt.value)}
                  className={`flex cursor-pointer items-center gap-2 px-3.5 py-2 text-sm transition-colors focus:bg-blue-50/60 focus:outline-none ${
                    isSelected
                      ? "bg-blue-50/80 text-blue-700 font-medium"
                      : "text-slate-700 hover:bg-slate-50/80"
                  }`}
                >
                  {(showImage || opt.image) && renderImage(opt.image, opt.label)}
                  <span className="truncate">{opt.label}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
