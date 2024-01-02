import { supabase } from "./supabase";
import { formatDate } from "./utils";

export async function getUserConfig({ router }) {
  const result = await supabase.auth.getSession();
  const userId = result?.data?.session?.user?.id;

  if (!userId) {
    return router.push("/login");
  }

  const { data } = await supabase
    .from("user_config")
    .select()
    .eq("user_id", userId)
    .single();

  if (!data) {
    return {
      userId,
      email: result?.data?.session?.user?.email,
    };
  }

  const hydration = await supabase
    .from("hydration")
    .select()
    .eq("user_id", data?.id)
    .eq("created_at", formatDate(new Date()))
    .single();

  const weightLossGoal = await supabase
    .from("weight_loss_goal")
    .select()
    .eq("user_id", data?.id)
    .single();

  const tx = await supabase
    .from("transaction")
    .select()
    .eq("user_id", data?.id)
    .order("created_at", { ascending: false });

  const totalXP = tx?.data
    ?.map(({ activeXP, consumptionXP }) => {
      return (
        parseInt(data?.baseXP, 10) +
        parseInt(activeXP || "0", 10) -
        parseInt(consumptionXP || "0", 10)
      );
    })
    ?.reduce((partialSum, a) => partialSum + a, 0);

  const txs = tx?.data?.sort((a, b) => {
    return (new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()) as number;
  });

  return {
    ...data,
    totalXP,
    userId,
    hydration: hydration?.data,
    email: result?.data?.session?.user?.email,
    tx: txs,
    todaysTx: txs?.[0],
    weight_loss_goal: weightLossGoal?.data,
  };
}
