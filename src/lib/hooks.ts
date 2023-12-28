import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getUserConfig } from "./data";
import { supabase } from "./supabase";
import { formatDate } from "./utils";

export function useCheckinStats({ userConfig }) {
  const [checkins, setActiveCheckIns] = useState<any>();
  useEffect(() => {
    supabase
      .from(`sobriety`)
      .select()
      .eq("user_id", userConfig?.id)
      .then(({ data }) => {
        if (data) {
          setActiveCheckIns(data as any);
        }
      });
  }, []);

  const soberDays = checkins
    ?.map(({ sober }) => {
      return sober ? 1 : 0;
    })
    ?.reduce((partialSum, a) => partialSum + a, 0);

  const nonSoberDays = checkins
    ?.map(({ sober }) => {
      return sober ? 0 : 1;
    })
    ?.reduce((partialSum, a) => partialSum + a, 0);

  return {
    soberDays,
    nonSoberDays,
  };
}

export function useSobrietyByDay({ date, userId }) {
  const [sobrietyCheckin, setSobrietyCheckIn] = useState<any>();

  function refetch() {
    supabase
      .from(`sobriety`)
      .select()
      .eq("user_id", userId)
      .eq("created_at", formatDate(new Date(date as any)))
      .single()
      .then(({ data }) => {
        if (data) {
          setSobrietyCheckIn(data as any);
        } else {
          setSobrietyCheckIn(undefined);
        }
      });
  }

  useEffect(() => {
    refetch();
  }, [date]);

  return {
    sobrietyCheckin,
    sobrietyRefetch: refetch,
  };
}

export function useJournalByDay({ date, userId }): {
  journal: any;
  journalRefetch: any;
} {
  const [journal, setJournal] = useState();

  function refetch() {
    const createdAt = formatDate(new Date(date as any));

    supabase
      .from(`journal`)
      .select()
      .eq("user_id", userId)
      .eq("created_at", createdAt)
      .single()
      .then(({ data }) => {
        if (data) {
          setJournal(data as any);
        } else {
          setJournal(undefined);
        }
      });
  }

  useEffect(() => {
    refetch();
  }, [date]);

  return {
    journal,
    journalRefetch: refetch,
  };
}

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
