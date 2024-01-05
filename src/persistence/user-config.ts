import { supabase } from "@/lib/supabase";

// { [key: string]: ANYTHING }

class UserConfig {
  async userConfigByUserId(userId: string) {
    const result = await supabase
      .from("user_config")
      .select()
      .eq("user_id", userId)
      .single();

    if (result.error) {
      // DO SOMETHING
      return;
    }

    return result.data;
  }

  // f(x, y)

  async updateUserConfig(id: string, data: Record<string, any>) {
    const result = await supabase.from("user_config").update(data).eq(`id`, id);

    if (result.error) {
      return;
    }

    return result.data;
  }

  async insertUserConfig(data: Record<string, any>) {
    const result = await supabase.from("user_config").insert(data);

    if (result.error) {
      return;
    }

    return result.data;
  }
}
