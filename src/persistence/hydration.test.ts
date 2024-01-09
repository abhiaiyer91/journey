import { Hydration } from "./hydration";

import { UserConfig } from "./user-config";

const TEST_USER_ID = `6509c302-42b6-42c5-84be-bf1826a8e7d1`;

const userConfig = new UserConfig();

const hydration = new Hydration();

describe("Hydration", () => {
    beforeAll(async () => {
        await userConfig.insertUserConfig({

            user_id: TEST_USER_ID,
            name: `Tyler Test`,
            height: 60,
            weight: 200,

        })


    })

    afterAll(async () => {
        const config = await userConfig.userConfigByUserId(TEST_USER_ID)
        await hydration.deleteHydrationByIdAndDate(config.id, "12/22/2023")
        await userConfig.deleteUserConfig(TEST_USER_ID)
    })

    it("Should upsert Hydration with upsertHydration", async () => {
        const config = await userConfig.userConfigByUserId(TEST_USER_ID)
        await hydration.upsertHydration({ value: 10, created_at: "12/22/2023", user_id: config.id })
        const updatedHydration = await hydration.hydrationByUserConfig(config.id, "12/22/2023")
        expect(updatedHydration.value).toBe(10)



    })

    it("Should update Hydration with updateHydration", async () => {
        const config = await userConfig.userConfigByUserId(TEST_USER_ID)
        let hydrationForDay = await hydration.hydrationByUserConfig(config.id, "12/22/2023")

        expect(hydrationForDay.value).toBe(10)
        await hydration.updateHydration(hydrationForDay.id, {
            value: 12
        })
        hydrationForDay = await hydration.hydrationByUserConfig(config.id, "12/22/2023")
        expect(hydrationForDay.value).toBe(12)
        
        await hydration.updateHydration(hydrationForDay.id, {
            value: 69
        })
        hydrationForDay = await hydration.hydrationByUserConfig(config.id, "12/22/2023")
        expect(hydrationForDay.value).toBe(69)

    })

})