import { Vision } from "./vision";

import { UserConfig } from "./user-config";

const TEST_USER_ID = `6509c302-42b6-42c5-84be-bf1826a8e7d1`;

const userConfig = new UserConfig();

const vision = new Vision();

describe("Vision", () => {
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
        await vision.deleteVisionById(config.id)
        await userConfig.deleteUserConfig(TEST_USER_ID)

    })
    it("Should upsert Vision with upsertVision", async () => {
        const config = await userConfig.userConfigByUserId(TEST_USER_ID)
        const updateVisionData = await vision.upsertVision({ user_id: config.id }) as any
        expect(updateVisionData).toBeTruthy()

        await vision.updateVision(updateVisionData?.id, { user_id: config.id })
    })
})


