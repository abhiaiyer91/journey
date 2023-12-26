"use client";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import "../lib/globals.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { UserNav } from "@/components/layout";
import { AddHydration } from "@/components/Hydration";
import { Overview } from "@/components/Overview";
import { Progress } from "@/components/ui/progress";

function startOfDay() {
  var start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

const Chart = dynamic(() => import("react-charts").then((mod) => mod.Chart), {
  ssr: false,
});

const transactionSchema = z.object({
  type: z.string(),
  value: z.string(),
});

const formSchema = z.object({
  name: z.string(),
  age: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  height: z.string(),
  weight: z.string(),
  metric_type: z.enum(["IMPERIAL", "METRIC"]),
  activity: z.enum(["SEDENTARY", "LIGHT", "MODERATE", "HEAVY", "ATHLETE"]),
});

const activityMultiplier = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  HEAVY: 1.725,
  ATHLETE: 1.9,
};

// Create a single supabase client for interacting with your database

function TDEEForm({ form, metric_type, setTD }) {
  return (
    <>
      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem className="mb-2">
            <FormLabel>
              Height {metric_type === `IMPERIAL` ? `(ft)` : `(cm)`}
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="5ft 9in" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="55">4ft 7in</SelectItem>
                  <SelectItem value="56">4ft 8in</SelectItem>
                  <SelectItem value="57">4ft 9in</SelectItem>
                  <SelectItem value="58">4ft 10in</SelectItem>
                  <SelectItem value="59">4ft 11in</SelectItem>
                  <SelectItem value="60">5ft 0in</SelectItem>
                  <SelectItem value="61">5ft 1in</SelectItem>
                  <SelectItem value="62">5ft 2in</SelectItem>
                  <SelectItem value="63">5ft 3in</SelectItem>
                  <SelectItem value="64">5ft 4in</SelectItem>
                  <SelectItem value="65">5ft 5in</SelectItem>
                  <SelectItem value="66">5ft 6in</SelectItem>
                  <SelectItem value="67">5ft 7in</SelectItem>
                  <SelectItem value="68">5ft 8in</SelectItem>
                  <SelectItem value="69">5ft 9in</SelectItem>
                  <SelectItem value="70">5ft 10in</SelectItem>
                  <SelectItem value="71">5ft 11in</SelectItem>
                  <SelectItem value="72">6ft 0in</SelectItem>
                  <SelectItem value="73">6ft 1in</SelectItem>
                  <SelectItem value="74">6ft 2in</SelectItem>
                  <SelectItem value="75">6ft 3in</SelectItem>
                  <SelectItem value="76">6ft 4in</SelectItem>
                  <SelectItem value="77">6ft 5in</SelectItem>
                  <SelectItem value="78">6ft 6in</SelectItem>
                  <SelectItem value="79">6ft 7in</SelectItem>
                  <SelectItem value="80">6ft 8in</SelectItem>
                  <SelectItem value="81">6ft 9in</SelectItem>
                  <SelectItem value="82">6ft 10in</SelectItem>
                  <SelectItem value="83">6ft 11in</SelectItem>
                  <SelectItem value="84">7ft 0in</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem className="mb-2">
            <FormLabel>
              Weight {metric_type === `IMPERIAL` ? `(lb)` : `(kg)`}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={metric_type === `IMPERIAL` ? `lb` : `kg`}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="activity"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Activity</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Please select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEDENTARY">Sedentary</SelectItem>
                  <SelectItem value="LIGHT">Light Excercise</SelectItem>
                  <SelectItem value="MODERATE">Moderate Excercise</SelectItem>
                  <SelectItem value="HEAVY">Heavy Excercise</SelectItem>
                  <SelectItem value="ATHLETE">Athlete</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function BasicInfo({ form }) {
  // 1. Define your form.
  return (
    <section>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="mb-2">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="John" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem className="mb-2">
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MALE" id="MALE" />
                  <Label htmlFor="MALE">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FEMALE" id="FEMALE" />
                  <Label htmlFor="FEMALE">Female</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input placeholder="32" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}

function TDEECalculator({ form, setTD }) {
  return (
    <section className="mb-2">
      <Tabs defaultValue="IMPERIAL" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="IMPERIAL">Imperial</TabsTrigger>
          <TabsTrigger value="METRIC">Metric</TabsTrigger>
        </TabsList>
        <TabsContent value="IMPERIAL">
          <TDEEForm form={form} setTD={setTD} metric_type="IMPERIAL" />
        </TabsContent>
        <TabsContent value="METRIC">
          <TDEEForm form={form} setTD={setTD} metric_type="METRIC" />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function Fitness({ userConfig, hasCancel = false, userId, refetch }) {
  // Fetch Apple HealthKit Data
  // TDEE CALCULATOR
  // CALORIES PER LB OF FAT
  // MFP or
  // Calendar
  // TOTAL REMAINING

  console.log(userConfig, userId);

  const [tde, setTDE] = useState(0);

  function setTD(val: number) {
    setTDE(val);
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metric_type: "IMPERIAL",
      name: userConfig?.name,
      ...userConfig,
      user_id: userId,
      height: userConfig?.height ? `${userConfig?.height}` : ``,
      weight: `${userConfig?.weight || ``}`,
      age: `${userConfig?.age || ``}`,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    let weight = parseInt(values.weight, 10);
    let height = parseInt(values.height, 10);
    if (values.metric_type === `IMPERIAL`) {
      weight = weight * 0.453;
      height = height * 2.54;
    }

    let result;
    if (values?.gender === `MALE`) {
      result = 10 * weight + 6.25 * height - 5 * parseInt(values.age, 10) + 5;
    } else {
      result = 10 * weight + 6.25 * height - 5 * parseInt(values.age, 10) - 161;
    }

    setTD(result * activityMultiplier[values.activity]);

    supabase
      .from("user_config")
      .upsert({
        ...values,
        id: userConfig?.id,
        user_id: userId,
        tdee: result * activityMultiplier[values.activity],
        baseXP: result * activityMultiplier[values.activity] - 500,
      })
      .then(({ data, error }) => {
        console.log(error, data);

        return refetch();
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <BasicInfo form={form} />
        <TDEECalculator setTD={setTD} form={form} />

        <div className="text-right mt-4">
          {hasCancel && (
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          )}
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

function AddWeight({ userConfig, refetch }) {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "IMPERIAL",
    },
  });

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    const transaction = await supabase
      .from("weight_tracker")
      .select()
      .eq("created_at", start.toUTCString())
      .single();

    await supabase.from("weight_tracker").upsert({
      created_at: start.toUTCString(),
      ...transaction?.data,
      user_id: userConfig?.id,
      type: "IMPERIAL",
      value: values.value,
    });

    await supabase
      .from("user_config")
      .update({
        weight: parseFloat(values?.value),
      })
      .eq("id", userConfig?.id);

    return refetch();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Weight</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Value in lbs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-right mt-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function AddWeightTarget({ userConfig, refetch }) {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "IMPERIAL",
    },
  });

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    const transaction = await supabase
      .from("weight_loss_goal")
      .select()
      .eq("user_id", userConfig?.id)
      .single();

    await supabase.from("weight_loss_goal").upsert({
      created_at: start.toUTCString(),
      ...transaction?.data,
      description: `Weight loss goal`,
      user_id: userConfig?.id,
      total: values.value,
    });

    return refetch();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Weight Target</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Value in lbs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-right mt-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function ActivityActiveState({
  onFinish,
  userConfig,
  hasCancel = false,
  disableCard = false,
  disableHeader = false,
  refetch,
}) {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    const transaction = await supabase
      .from("transaction")
      .select()
      .eq("user_id", userConfig?.id)
      .eq("created_at", start.toUTCString())
      .single();

    let updateOb = {};
    if (!transaction?.data) {
      if (values.type === "ACTIVE_CAL") {
        updateOb = { activeXP: values.value };
      } else {
        updateOb = { consumptionXP: values.value };
      }

      await supabase.from("transaction").upsert({
        created_at: start.toUTCString(),
        user_id: userConfig?.id,
        ...transaction?.data,
        ...updateOb,
      });

      return refetch();
    }

    let value = parseInt(values.value, 10);

    if (values.type === "ACTIVE_CAL" && transaction?.data) {
      value = parseInt(transaction?.data?.activeXP || "0", 10) + value;
      updateOb = { activeXP: value };
    } else {
      value = parseInt(transaction?.data?.consumptionXP || "0", 10) + value;
      updateOb = { consumptionXP: value };
    }

    await supabase.from("transaction").upsert({
      created_at: start.toUTCString(),
      ...transaction?.data,
      ...updateOb,
    });

    onFinish();

    return refetch();
  }

  const formComp = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ACTIVE_CAL" id="ACTIVE_CAL" />
                    <Label htmlFor="ACTIVE_CAL">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="CONSUMPTION_CAL"
                      id="CONSUMPTION_CAL"
                    />
                    <Label htmlFor="CONSUMPTION_CAL">Consumption</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Value in calories" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right mt-4">
          {hasCancel && (
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          )}
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );

  if (disableCard) {
    return <>{formComp}</>;
  }

  return (
    <Card>
      <CardHeader>
        {!disableHeader && <CardTitle>Add Activity</CardTitle>}
      </CardHeader>

      <CardContent>{formComp}</CardContent>
    </Card>
  );
}

function AddActivity({ userConfig, refetch }) {
  return (
    <section className="text-left">
      <Drawer>
        <DrawerTrigger>
          <CardDescription className="underline">Add Activity</CardDescription>
        </DrawerTrigger>
        <DrawerContent>
          <div className="pb-8 mx-auto max-w-96" style={{ width: `100%` }}>
            <ActivityActiveState
              userConfig={userConfig}
              disableCard
              refetch={refetch}
              hasCancel
              onFinish={() => {}}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
}

function AppView({
  tx,
  userConfig,
  refetch,
}: {
  tx;
  refetch;
  userConfig: any;
}) {
  const [toggleEdit, setToggleEdit] = useState(false);

  if (userConfig?.name) {
    return (
      <>
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl tracking-tight">
              Welcome back{" "}
              <span className="font-bold">{userConfig?.name}!</span>
            </h2>
            <Sheet>
              <SheetTrigger>
                <p className="text-xs underline">Edit profile</p>
              </SheetTrigger>
              <SheetContent>
                <Fitness
                  userConfig={userConfig}
                  userId={userConfig?.userId}
                  refetch={refetch}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userConfig?.weight?.toFixed(2)}
                  {userConfig?.metric_type === `IMPERIAL` ? `lbs` : `kg`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Target: {` `}
                  {userConfig?.weight_loss_goal
                    ? parseInt(userConfig?.weight_loss_goal?.total, 10)
                    : ``}
                  {userConfig?.metric_type === `IMPERIAL` ? `lbs` : `kg`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Remaining: {` `}
                  {userConfig?.weight_loss_goal
                    ? parseInt(userConfig?.weight, 10) -
                      parseInt(userConfig?.weight_loss_goal?.total, 10)
                    : ``}
                  {userConfig?.metric_type === `IMPERIAL` ? `lbs` : `kg`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hydration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userConfig?.hydration?.value}oz
                </div>
                <AddHydration userConfig={userConfig} refetch={refetch} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spec</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US").format(
                    userConfig?.baseXP?.toFixed(2)
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  TDEE:{" "}
                  {new Intl.NumberFormat("en-US").format(
                    userConfig?.tdee?.toFixed(2)
                  )}
                </p>

                <div>
                  <Progress
                    value={(
                      (userConfig?.totalXP /
                        (5000 *
                          (parseFloat(userConfig?.weight) -
                            parseInt(
                              userConfig?.weight_loss_goal?.total,
                              10
                            )))) *
                      100
                    ).toFixed(2)}
                  />

                  {userConfig?.weight_loss_goal ? (
                    <p className="text-xs text-right text-muted-foreground">
                      {userConfig?.totalXP} /
                      {new Intl.NumberFormat("en-US").format(
                        5000 *
                          (parseFloat(userConfig?.weight) -
                            parseInt(userConfig?.weight_loss_goal?.total, 10))
                      )}
                      XP
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Tabs defaultValue="ACTIVE">
                  <TabsList>
                    <TabsTrigger value="ACTIVE">Active</TabsTrigger>
                    <TabsTrigger value="WEIGHT">Weight</TabsTrigger>
                    <TabsTrigger value="CONSUMPTION">Consumption</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ACTIVE">
                    <Overview tx={tx} type="ACTIVE" chartType="BAR" />
                  </TabsContent>
                  <TabsContent value="WEIGHT">
                    <Overview tx={tx} type="WEIGHT" chartType="LINE" />
                  </TabsContent>
                  <TabsContent value="CONSUMPTION">
                    <Overview tx={tx} type="CONSUMPTION" chartType="BAR" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Data</CardTitle>

                <AddActivity userConfig={userConfig} refetch={refetch} />
              </CardHeader>
              <CardContent className="pl-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Date</TableHead>
                      <TableHead>Base XP</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Consumed</TableHead>
                      <TableHead>Total XP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      {tx?.map((t) => {
                        console.log(
                          t,
                          parseFloat(userConfig?.baseXP?.toFixed(2)) +
                            parseInt(t?.activeXP || "0", 10)
                          // parseInt(t?.consumptionXP || "0", 10)
                        );
                        return (
                          <>
                            {" "}
                            <TableCell className="font-medium">
                              {new Date(t.created_at).toISOString()}
                            </TableCell>
                            <TableCell>
                              {userConfig?.baseXP?.toFixed(2)}
                            </TableCell>
                            <TableCell>{t?.activeXP}</TableCell>
                            <TableCell>{t?.consumptionXP}</TableCell>
                            <TableCell>
                              {parseFloat(userConfig?.baseXP?.toFixed(2)) +
                                parseInt(t?.activeXP || "0", 10) -
                                parseInt(t?.consumptionXP || "0", 10)}
                            </TableCell>
                          </>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <h1 className="text-lg font-extrabold">How it works</h1>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-0">
                  <AccordionTrigger>Add a weight target</AccordionTrigger>
                  <AccordionContent>
                    <AddWeightTarget
                      userConfig={userConfig}
                      refetch={refetch}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Record your weight daily</AccordionTrigger>
                  <AccordionContent>
                    <AddWeight userConfig={userConfig} refetch={refetch} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Track XP</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">Integrations coming soon.</p>
                    <ActivityActiveState
                      disableHeader
                      refetch={refetch}
                      userConfig={userConfig}
                      onFinish={() => {
                        // setActive(false);
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>The Basics</CardTitle>
      </CardHeader>

      <CardContent>
        <Fitness
          userConfig={userConfig}
          userId={userConfig?.userId}
          refetch={refetch}
        />
      </CardContent>
    </Card>
  );
}

async function getUserConfig({ router }) {
  const result = await supabase.auth.getSession();
  const userId = result?.data?.session?.user?.id;

  if (!userId) {
    return router.push("/login");
  }

  const { data } = await supabase
    .from("user_config")
    .select()
    .eq("user_id", userId)
    .single();

  if (!data) {
    return {
      userId,
      email: result?.data?.session?.user?.email,
    };
  }

  const hydration = await supabase
    .from("hydration")
    .select()
    .eq("user_id", data?.id)
    .eq("created_at", startOfDay().toISOString())
    .single();

  console.log(hydration);

  const weightLossGoal = await supabase
    .from("weight_loss_goal")
    .select()
    .eq("user_id", data?.id)
    .single();

  const tx = await supabase
    .from("transaction")
    .select()
    .eq("user_id", data?.id);

  const totalXP = tx?.data?.map(({ activeXP, consumptionXP }) => {
    return (
      parseInt(data?.baseXP, 10) +
      parseInt(activeXP || "0", 10) -
      parseInt(consumptionXP || "0", 10)
    );
  });

  console.log({ totalXP });

  return {
    ...data,
    totalXP,
    userId,
    hydration: hydration?.data,
    email: result?.data?.session?.user?.email,
    tx: tx?.data,
    weight_loss_goal: weightLossGoal?.data,
  };
}

export default function Home() {
  const [userConfig, setUserConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState([]);

  const router = useRouter();

  const refetch = () => {
    if (!userConfig) {
      setLoading(true);
    }

    getUserConfig({ router }).then((data) => {
      setUserConfig(data);

      if (data?.tx) {
        setTx(data?.tx);
      }

      setLoading(false);
    });
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="font-extrabold">Journey</div>

          <div className="ml-auto flex items-center space-x-4">
            <UserNav userConfig={userConfig} />
          </div>
        </div>
      </div>

      <main className="flex-1 space-y-4 p-8 pt-6">
        {loading ? null : (
          <AppView userConfig={userConfig} tx={tx} refetch={refetch} />
        )}
      </main>
    </>
  );
}
