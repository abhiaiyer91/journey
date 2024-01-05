import { supabase } from "@/lib/supabase";

class Hydration {

    async updateHydration(id: string, data: Record<string, any>) {
        const result = await supabase.from("hydration").update(data).eq(`id`, id);

        if (result.error) {
            return;
        }

        return result.data;
    }

    async upsertHydration(data) {
        const result = await supabase.from("hydration").upsert(data);

        if (result.error) {
            return;
        }

        return result.data;
    }

}