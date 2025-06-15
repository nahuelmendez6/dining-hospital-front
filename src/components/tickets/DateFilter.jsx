const DateFilter = ({ value, onChange }) => {
    return (
      <input
        type="date"
        className="form-control w-auto shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
  
  export default DateFilter;
  