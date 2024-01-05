import { supabase } from "@/lib/supabase";

class WeightTracker {

    async updateWeightTracker(id: string, data: Record<string, any>) {
        const result = await supabase.from("weight_tracker").update(data).eq(`id`, id);
        if (result.error) {
            return;
        }

        return result.data;
    }
    async insertWeightTracker(data: Record<string, any>) {
        const result = await supabase.from("weight_tracker").insert(data);

        if (result.error) {
            return;
        }

        return result.data;
    }
}