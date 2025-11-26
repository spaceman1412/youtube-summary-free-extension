import type { Dispatch, SetStateAction } from "react";
import { languages, models, lengths } from "../constants";
import {
  pickerRowStyle,
  selectStyle,
  smallPickerLabelStyle,
} from "../styles";
import { CustomModelSelect } from "./CustomModelSelect";

type PickerControlsProps = {
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
  length: string;
  setLength: Dispatch<SetStateAction<string>>;
};

const renderSelect = (
  label: string,
  value: string,
  onChange: (next: string) => void,
  options: { label: string; value: string }[]
) => (
  <label style={smallPickerLabelStyle}>
    {label}
    <select
      style={selectStyle}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export function PickerControls({
  language,
  setLanguage,
  model,
  setModel,
  length,
  setLength,
}: PickerControlsProps) {
  return (
    <div style={pickerRowStyle}>
      {renderSelect("Language", language, setLanguage, languages)}
      <CustomModelSelect
        label="Model"
        value={model}
        onChange={setModel}
        options={models}
      />
      {renderSelect("Length", length, setLength, lengths)}
    </div>
  );
}

