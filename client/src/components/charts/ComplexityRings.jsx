import { ProgressRing } from "../ui/ProgressRing";

export function ComplexityRings({ scores }) {
  const data = [
    { label: "Readiness", val: scores?.readiness ?? 84, color: "stroke-nova" },
    { label: "Maintainability", val: scores?.maintainability ?? 75, color: "stroke-nebula" },
    { label: "Coverage", val: scores?.coverage ?? 45, color: "stroke-solar" },
    { label: "Tech Debt", val: scores?.techDebt ?? 50, color: "stroke-aurora" },
    { label: "Risk Factor", val: scores?.risk ?? 23, color: "stroke-supernova" }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-center items-center py-4">
      {data.map((ring) => (
        <ProgressRing
          key={ring.label}
          value={ring.val}
          size={100}
          strokeWidth={6}
          color={ring.color}
          label={ring.label}
        />
      ))}
    </div>
  );
}

export default ComplexityRings;
