import { supabase } from "@/lib/supabase";

class Transaction {

    async upsertTransaction(data) {
        const result = await supabase.from("transaction").upsert(data);

        if (result.error) {
            return;
        }

        return result.data;
    }


}