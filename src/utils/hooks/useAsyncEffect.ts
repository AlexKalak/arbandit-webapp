import { useEffect, useState } from "react";

export function useAsyncEffect<T>(
  asyncFn: () => Promise<T>,
  deps: readonly unknown[] = [],
) {
  const [data, setData] = useState<T>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error>()


  useEffect(() => {
    console.log("shit")
    let cancelled = false;

    (async () => {
      setIsLoading(true);

      try {
        const res = await asyncFn();
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError(e as Error);
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })();

    return () => {
      cancelled = true;
    }
  }, [])

  return { data, isLoading, error }
}
