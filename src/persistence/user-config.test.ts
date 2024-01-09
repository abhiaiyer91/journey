import { UserConfig } from "./user-config";

const TEST_USER_ID = `6509c302-42b6-42c5-84be-bf1826a8e7d1`;

const userConfig = new UserConfig();

describe("UserConfig", () => {
  // DESCRIBE BLOCK

  //   beforeEach(() => {
  //     console.log("BEFORE EACH");
  //   });

  //   beforeAll(() => {
  //     console.log("BEFORE ALL");
  //   });

  //   afterEach(() => {
  //     console.log("AFTER EACH");
  //   });

  afterAll(async () => {
    await userConfig.deleteUserConfig(TEST_USER_ID);
  });

  it("Newly created user does not have a user config", async () => {
    const result = await userConfig.userConfigByUserId(TEST_USER_ID);

    expect(result).toBeUndefined();
  });

  it("Should create a user config when insertUserConfig is called", async () => {
    await userConfig.insertUserConfig({
      user_id: TEST_USER_ID,
      name: `Tyler Test`,
      height: 60,
      weight: 200,
    });

    const config = await userConfig.userConfigByUserId(TEST_USER_ID);

    expect(config.name).toBe("Tyler Test");
  });

  it("Should update the user config when updateUserConfigByUserId is called", async () => {
    await userConfig.updateUserConfigByUserId(TEST_USER_ID, {
      name: `Tyler Test 2`,
    });

    const config = await userConfig.userConfigByUserId(TEST_USER_ID);

    expect(config.name).toBe("Tyler Test 2");
  });

  it("Should update the user config when updateUserConfig is called", async () => {
    const currentUserConfig = await userConfig.userConfigByUserId(TEST_USER_ID);

    await userConfig.updateUserConfig(currentUserConfig.id, {
      name: `Tyler Test 3`,
    });

    const config = await userConfig.userConfigByUserId(TEST_USER_ID);

    expect(config.name).toBe("Tyler Test 3");
  });
});
