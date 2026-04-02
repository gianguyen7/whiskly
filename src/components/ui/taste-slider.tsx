"use client";

interface TasteSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

/**
 * Slider component for rating a taste dimension (1-5).
 * Used in the matcha logging form.
 */
export function TasteSlider({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
}: TasteSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-matcha-700">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-matcha-100 rounded-lg appearance-none cursor-pointer accent-matcha-600"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
