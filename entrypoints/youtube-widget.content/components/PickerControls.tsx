import type { Dispatch, SetStateAction } from "react";
import { languages, models, lengths } from "../constants";
import { styles } from "../styles";
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
  <label style={styles.picker.label.small}>
    {label}
    <select
      style={styles.picker.select}
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
    <div style={styles.picker.row}>
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

