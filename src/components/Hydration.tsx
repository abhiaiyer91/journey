import React from "react";
import * as z from "zod";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Progress } from "./ui/progress";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { CardDescription } from "./ui/card";
import { supabase } from "@/lib/supabase";

export function AddHydration({ userConfig, refetch }) {
  const progressVal = ((userConfig?.hydration?.value || 0) / 128) * 100;

  const [goal, setGoal] = React.useState(userConfig?.hydration?.value || 0);

  function onClick(adjustment: number) {
    setGoal(Math.max(0, goal + adjustment));
  }

  async function submitHydration() {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    await supabase.from("hydration").upsert({
      created_at: start.toUTCString(),
      user_id: userConfig?.id,
      value: goal,
    });

    return refetch();
  }

  return (
    <>
      <Progress value={progressVal} />
      <section className="text-right">
        <Drawer>
          <DrawerTrigger>
            <CardDescription>Add</CardDescription>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Hydration</DrawerTitle>
                <DrawerDescription>Set your hydration level.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => onClick(-8)}
                    disabled={goal <= 0}
                  >
                    <MinusIcon className="h-4 w-4" />
                    <span className="sr-only">Decrease</span>
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-7xl font-bold tracking-tighter">
                      {goal}
                    </div>
                    <div className="text-[0.70rem] uppercase text-muted-foreground">
                      Oz
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => onClick(8)}
                    disabled={goal >= 128}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span className="sr-only">Increase</span>
                  </Button>
                </div>
                {/* <div className="mt-3 h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <Bar
                          dataKey="goal"
                          style={
                            {
                              fill: "hsl(var(--foreground))",
                              opacity: 0.9,
                            } as React.CSSProperties
                          }
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div> */}
              </div>
              <DrawerFooter>
                <Button
                  onClick={() => {
                    submitHydration().catch((e) => {
                      console.error(e);
                    });
                  }}
                >
                  Submit
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </section>
    </>
  );
}
