import { supabase } from "../lib/supabase";

export class Hydration {

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
    async hydrationByUserConfig(id: string, created_at: string) {
        const result = await supabase.from("hydration").select().eq("user_id", id).eq("created_at", created_at).single()

        if (result.error) {
            return;
        }

        return result.data;


    }
    async deleteHydrationByIdAndDate(id: number, created_at: string) {
        const result = await supabase
            .from("hydration")
            .delete()
            .eq("user_id", id).eq("created_at", created_at)


        if (result.error) {
            console.error(result.error);
        }
    }
}