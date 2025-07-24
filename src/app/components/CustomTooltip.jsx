const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  // Only show tooltip for main data points (which have disaster_type)
  if (!d.disaster_type) return null;
  return (
    <div className="bg-white/95 text-black p-4 rounded border border-gray-300 w-96 shadow-lg font-arial-sans text-lg">
      <p className="font-bold text-lg mb-2">
        {d.disaster_type} in {d.country}
      </p>
      <p className="italic mb-2">
        Start year: {d.start_year}
      </p>
      {d.summary && (
        <p className="mt-2 pt-2 border-t border-gray-200 whitespace-pre-line leading-relaxed">
          {d.summary}
        </p>
      )}
    </div>
  );
};

export default CustomTooltip;




