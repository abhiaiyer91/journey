import { supabase } from "@/lib/supabase";

class FoodDb {

  async insertFoodDb(data: Record<string, any>) {
    const result = await supabase.from("food_db").insert(data);

    if (result.error) {
      return;
    }

    return result.data;
  }

}