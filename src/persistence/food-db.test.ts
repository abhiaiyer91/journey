import { FoodDb } from "./food-db";

import { UserConfig } from "./user-config";

const TEST_USER_ID = `6509c302-42b6-42c5-84be-bf1826a8e7d1`;

const userConfig = new UserConfig();

const foodDb = new FoodDb();

describe("food-db", () => {
    let food;
    
    afterAll(async () => {
        console.log(food)
       await foodDb.deleteFoodDbById(food.id)
    })

    it("Should insert food into FoodDb", async () => {

    food = await foodDb.insertFoodDb({name: "Beef Jerky"})
    console.log(food)
        expect(food.name).toBe("Beef Jerky")


    })

})