import { supabase } from "../lib/supabase";

export class Transaction {

    async upsertTransaction(data) {
        const result = await supabase.from("transaction").upsert(data);

        if (result.error) {
            return;
        }

        return result.data;
    }
    async getTransactionByDay(id: string, created_at: string) {
        const result = await supabase.from("transaction").select().eq("user_id", id).eq("created_at", created_at).single();
        if (result.error) {
            return;
        }

        return result.data;
    }
    async deleteTransactionByDay(id: string, created_at: string) {
        const result = await supabase.from("transaction").delete().eq("user_id", id).eq("created_at", created_at)
        if (result.error) {
            return;
        }

        return result.data;
    }
    
}