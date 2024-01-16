import { supabase } from "../lib/supabase";

export class FoodDb {

  async insertFoodDb(data: Record<string, any>) {
    const result = await supabase.from("food_db").upsert(data).select().single();

    if (result.error) {
      return;
    }

    return result.data;
  }
  
    async deleteFoodDbById(id: number) {
        const result = await supabase
            .from("food_db")
            .delete()
            .eq("id",id)


        if (result.error) {
            console.error(result.error);
        }
    }
}