import { useState, useEffect } from 'react';

const useFetchData = (fetchFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const result = await fetchFunction();
      if (result.status === 500) {
        setError(result.message);
        throw new Error(result.message);
      };
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetchData;
