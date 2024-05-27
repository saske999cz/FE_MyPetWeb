import React from "react";
import { Input, Typography } from "antd";

function CustomInput({ label, placeholder, type, value, onChange }) {
  return (
    <div className="input_container w-full h-24 flex flex-col items-start justify-center">
      <Typography.Text className="text-[14px]">{label}</Typography.Text>
      <Input
        className="input_field w-full h-12"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default CustomInput;
