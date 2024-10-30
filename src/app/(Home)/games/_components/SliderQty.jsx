import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

export const SliderQty = ({
  min,
  max,
  onChange,
  selectedMin,
  selectedMax,
  cartItem,
}) => {
  const [minVal, setMinVal] = useState(selectedMin);
  const [maxVal, setMaxVal] = useState(selectedMax);
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const rangeRef = useRef(null);

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Update range width and position
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  // Notify parent of changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div
      className={clsx(
        "relative flex-1",
        cartItem?.quantity > 0
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      )}
    >
      <input
        disabled={cartItem?.quantity > 0}
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className="thumb w-full h-1 appearance-none bg-transparent z-20"
      />
      <input
        disabled={cartItem?.quantity > 0}
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="thumb w-full h-1 appearance-none bg-transparent z-30"
      />

      <div className="relative h-2 bg-gray-300 rounded">
        <div ref={rangeRef} className="absolute h-2 bg-Gold rounded" />
      </div>

      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{minVal}</span>
        <span>{maxVal}</span>
      </div>
    </div>
  );
};
