export const Filter = ({ activeCount }) => {
  return (
    <div className="mb-4 flex items-center justify-between text-sm md:text-base">
      <div className="text-[#6a7282]">
        <span className="font-semibold text-[#333]">All</span>
        {" | Active | Completed"}
      </div>
      <span className="text-[#6a7282]">{activeCount} tasks left</span>
    </div>
  );
};
