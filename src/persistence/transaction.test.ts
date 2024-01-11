import { Transaction } from "./transaction";

import { UserConfig } from "./user-config";

const TEST_USER_ID = `6509c302-42b6-42c5-84be-bf1826a8e7d1`;

const userConfig = new UserConfig();

const transaction = new Transaction();

describe("Transaction", () => {
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
        await transaction.deleteTransactionByDay(config.id, "01/10/2024")
        await userConfig.deleteUserConfig(TEST_USER_ID)
    })

    it("It should upsert the transaction", async () => {
        const config = await userConfig.userConfigByUserId(TEST_USER_ID)
        await transaction.upsertTransaction({
            user_id: config.id,
            created_at: "01/10/2024",
            protein: "10",
            carb: "",
            fat: "",
            activeXP: "1000",


        })
        const tx = await transaction.getTransactionByDay(config.id, "01/10/2024")
        expect(tx.protein).toBe("10")


    })
})




