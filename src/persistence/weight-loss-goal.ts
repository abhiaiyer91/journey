import { supabase } from "@/lib/supabase";

class WeightLossGoal {
    async upsertWeightLossGoal(data) {

        const result = await supabase.from("weight_loss_goal").upsert(data);
        if (result.error) {
            return;
        }
        return result.data
    }
}