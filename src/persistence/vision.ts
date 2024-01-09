import { supabase } from "@/lib/supabase";

class Vision {

    async updateVision(id: string, data: Record<string, any>) {
        const result = await supabase.from("vision").update(data).eq(`id`, id);
        if (result.error) {
            return;
        }

        return result.data;
    }

    async upsertVision(data: Record<string, any>) {
        const result = await supabase.from("vision").upsert(data);

        if (result.error) {
            return;
        }

        return result.data;
    }



}