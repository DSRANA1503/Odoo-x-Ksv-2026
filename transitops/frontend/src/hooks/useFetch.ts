import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export function useFetch<T>(url: string, fallbackData: T) {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    axiosClient.get(url)
      .then(res => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.warn(`API call to ${url} failed, using fallback data.`, err);
          setError(err.message);
          setData(fallbackData);
          setLoading(false);
        }
      });
      
    return () => { isMounted = false; };
  }, [url]);

  return { data, loading, error, setData };
}
