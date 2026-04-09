"use client";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

/**
 * Star rating component for overall matcha rating (1-5).
 * Supports both interactive (form input) and readonly (display) modes.
 */
export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${sizeClasses[size]} ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } transition-transform`}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill={star <= value ? "#7fb22e" : "none"}
            stroke={star <= value ? "#7fb22e" : "#d1d5db"}
            strokeWidth={2}
            className="w-full h-full"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
