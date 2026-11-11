const SelectField = ({ label, value, onChange, options }) => {
  const inputClass =
    "w-full h-11 px-4 font-body text-sm text-black bg-[#F0F0F0] rounded-full border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all";
  return (
    <div>
      <label className="font-body text-sm text-black/60 mb-1.5 block">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none cursor-pointer`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};
export default SelectField;
