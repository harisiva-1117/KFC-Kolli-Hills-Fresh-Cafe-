import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useCategories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    api
      .listCategories()
      .then((rows) => {
        if (alive) setData(rows || []);
      })
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}

export function useBestSellers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    api
      .listProducts({ bestSeller: true })
      .then((rows) => {
        if (alive) setData(rows || []);
      })
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}

export function useProducts(params = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify(params);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .listProducts(params)
      .then((rows) => alive && setData(rows || []))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading, error };
}
