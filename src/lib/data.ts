import { supabase } from "./supabase";
import { formatDate, startOfDay } from "./utils";

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
    .eq("user_id", data?.id);

  const totalXP = tx?.data?.map(({ activeXP, consumptionXP }) => {
    return (
      parseInt(data?.baseXP, 10) +
      parseInt(activeXP || "0", 10) -
      parseInt(consumptionXP || "0", 10)
    );
  });

  return {
    ...data,
    totalXP,
    userId,
    hydration: hydration?.data,
    email: result?.data?.session?.user?.email,
    tx: tx?.data,
    todaysTx: tx?.data?.[0],
    weight_loss_goal: weightLossGoal?.data,
  };
}
