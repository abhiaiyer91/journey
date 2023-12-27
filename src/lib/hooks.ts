import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getUserConfig } from "./data";

export function useUserConfig() {
  const [userConfig, setUserConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState([]);

  const router = useRouter();

  const refetch = () => {
    if (!userConfig) {
      setLoading(true);
    }

    getUserConfig({ router }).then((data) => {
      setUserConfig(data);

      if (data?.tx) {
        setTx(data?.tx);
      }

      setLoading(false);
    });
  };

  useEffect(() => {
    refetch();
  }, []);

  return {
    refetch,
    loading,
    tx,
    userConfig,
  };
}
