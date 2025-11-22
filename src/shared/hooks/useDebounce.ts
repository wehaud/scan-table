import { useMemo, useEffect } from "react";
import debounce from "lodash.debounce";

export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) => {
  const debouncedCallback = useMemo(
    () => debounce(callback, delay),
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
