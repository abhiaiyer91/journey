import { supabase } from "../lib/supabase";

// { [key: string]: ANYTHING }

export class UserConfig {
  async userConfigByUserId(userId: string) {
    const result = await supabase
      .from("user_config")
      .select()
      .eq("user_id", userId)
      .single();

    if (result.error) {
      console.error(result.error);
      return;
    }

    return result.data;
  }

  // f(x, y)

  async updateUserConfigByUserId(userId: string, data: Record<string, any>) {
    const result = await supabase
      .from("user_config")
      .update(data)
      .eq(`user_id`, userId);

    if (result.error) {
      console.error(result.error);
      return;
    }

    return result.data;
  }

  async updateUserConfig(id: string, data: Record<string, any>) {
    const result = await supabase.from("user_config").update(data).eq(`id`, id);

    if (result.error) {
      console.error(result.error);
      return;
    }

    return result.data;
  }

  async insertUserConfig(data: Record<string, any>) {
    const result = await supabase.from("user_config").insert(data);

    if (result.error) {
      console.error(result.error);
      return;
    }
  }

  async deleteUserConfig(userId: string) {
    const result = await supabase
      .from("user_config")
      .delete()
      .eq("user_id", userId);

    if (result.error) {
      console.error(result.error);
    }
  }
}
