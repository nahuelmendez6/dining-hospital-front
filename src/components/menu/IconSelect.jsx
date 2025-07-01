import React from "react";
import Select from "react-select";
import { foodIcons } from "../../icons/foodIcons";

const iconOptions = Object.keys(foodIcons).map((key) => ({
  value: key,
  label: key,
  icon: foodIcons[key],
}));

const customSingleValue = ({ data }) => (
  <div className="d-flex align-items-center gap-2">
    <data.icon />
    <span>{data.label}</span>
  </div>
);

const customOption = ({ data, innerRef, innerProps }) => (
  <div
    ref={innerRef}
    {...innerProps}
    className="d-flex align-items-center gap-2 px-3 py-2"
    style={{ cursor: "pointer" }}
  >
    <data.icon />
    <span>{data.label}</span>
  </div>
);

const IconSelect = ({ value, onChange }) => {
  return (
    <Select
      options={iconOptions}
      value={iconOptions.find((opt) => opt.value === value)}
      onChange={(opt) => onChange(opt.value)}
      components={{ SingleValue: customSingleValue, Option: customOption }}
      isSearchable
      classNamePrefix="react-select"
      styles={{
        container: (base) => ({ ...base, width: "100%" }),
        control: (base) => ({
          ...base,
          borderRadius: "0.5rem",
          borderColor: "#ced4da",
          minHeight: "30px",
          fontSize: "0.8rem",
        }),
        option: (base) => ({ ...base, fontSize: "0.8rem", padding: "4px 6px" }),
        singleValue: (base) => ({ ...base, fontSize: "0.8rem" }),
      }}
    />
  );
};

export default IconSelect;
