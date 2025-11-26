import { useEffect, useRef, useState } from "react";
import type { ModelOption } from "../types";
import {
  customSelectButtonStyle,
  customSelectContainerStyle,
  customSelectDropdownStyle,
  customSelectOptionDescriptionStyle,
  customSelectOptionLabelStyle,
  customSelectOptionStyle,
  largePickerLabelStyle,
} from "../styles";

type CustomModelSelectProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: ModelOption[];
};

export function CustomModelSelect({
  label,
  value,
  onChange,
  options,
}: CustomModelSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div style={largePickerLabelStyle}>
      <span>{label}</span>
      <div style={customSelectContainerStyle} ref={containerRef}>
        <button
          type="button"
          style={customSelectButtonStyle}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsOpen((previous) => !previous);
          }}
        >
          {selectedOption?.label ?? "Select model"}
        </button>
        {isOpen && (
          <div style={customSelectDropdownStyle}>
            {options.map((option) => {
              const isSelected = option.value === value;
              const isHovered = hoveredOption === option.value;
              return (
                <div
                  key={option.value}
                  style={{
                    ...customSelectOptionStyle,
                    background:
                      isSelected || isHovered
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleOptionClick(option.value);
                  }}
                  onMouseEnter={() => setHoveredOption(option.value)}
                  onMouseLeave={() => setHoveredOption(null)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div style={customSelectOptionLabelStyle}>{option.label}</div>
                  {option.description && (
                    <div style={customSelectOptionDescriptionStyle}>
                      {option.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

