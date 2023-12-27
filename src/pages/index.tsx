"use client";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";

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
  DrawerTrigger,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { MainNav, UserNav } from "@/components/layout";
import { AddHydration } from "@/components/Hydration";
import { Overview } from "@/components/Overview";
import { Progress } from "@/components/ui/progress";
import { FoodSearch } from "@/components/FoodSearch";
import { useUserConfig } from "@/lib/hooks";
import { DataTable } from "@/components/DataTable";

function startOfDay() {
  var start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

const transactionSchema = z.object({
  type: z.string(),
  value: z.string(),
  protein: z.string().optional(),
  carb: z.string().optional(),
  fat: z.string().optional(),
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
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Track weight</CardTitle>
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
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Add weight target</CardTitle>
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
  const [formType, setFormType] = useState("ACTIVE_CAL");
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "ACTIVE_CAL",
    },
  });

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    console.log({ values }, "###");

    const transaction = await supabase
      .from("transaction")
      .select()
      .eq("user_id", userConfig?.id)
      .eq("created_at", start.toUTCString())
      .single();

    let protein = values?.protein;
    let carb = values?.carb;
    let fat = values?.fat;

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
        protein,
        fat,
        carb,
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

      if (protein) {
        protein = `${
          parseFloat(transaction?.data?.protein || "0") + parseFloat(protein)
        }`;
      }

      if (fat) {
        fat = `${parseFloat(transaction?.data?.fat || "0") + parseFloat(fat)}`;
      }

      if (carb) {
        carb = `${
          parseFloat(transaction?.data?.carb || "0") + parseFloat(carb)
        }`;
      }
    }

    await supabase.from("transaction").upsert({
      created_at: start.toUTCString(),
      ...transaction?.data,
      ...updateOb,
      protein,
      fat,
      carb,
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
                    <RadioGroupItem
                      onClick={() => {
                        setFormType("ACTIVE_CAL");
                      }}
                      value="ACTIVE_CAL"
                      id="ACTIVE_CAL"
                    />
                    <Label htmlFor="ACTIVE_CAL">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      onClick={() => {
                        setFormType("CONSUMPTION_CAL");
                      }}
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

        {formType === `CONSUMPTION_CAL` ? (
          <FoodSearch
            setFieldValue={(val) => {
              if (val) {
                Object.entries(val).forEach(([k, v]) => {
                  if (v) {
                    if (k === `calories`) {
                      return form.setValue("value", `${v}`);
                    }
                    return form.setValue(k as any, `${v}`);
                  }
                });
              }
            }}
          />
        ) : null}

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
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
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

const foodSchema = z.object({
  calories: z.string(),
  carb: z.string(),
  protein: z.string(),
  fat: z.string(),
  name: z.string(),
  barcode: z.string(),
  identifier: z.string(),
  serving_size: z.string(),
});

function FoodForm() {
  const [searchText, setSearchText] = useState(``);

  const form = useForm<z.infer<typeof foodSchema>>({
    resolver: zodResolver(foodSchema),
  });

  useEffect(() => {
    if (searchText) {
      const URI = `https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.NEXT_PUBLIC_FOOD_APP_ID}&app_key=${process.env.NEXT_PUBLIC_FOOD_API}&nutrition-type=logging&ingr=${searchText}`;

      fetch(URI)
        .then((res) => res.json())
        .then((d) => {
          const measure = d?.hints?.[0]?.measures?.find(
            ({ label }) => label === `Serving`
          );
          const food = d?.hints?.[0]?.food;

          console.log({ food, measure });
          form.setValue("name", food?.label);
          form.setValue("identifier", food?.foodId);
          form.setValue("protein", `${food?.nutrients?.PROCNT || 0}`);
          form.setValue("fat", `${food?.nutrients?.FAT || 0}`);
          form.setValue("calories", `${food?.nutrients?.ENERC_KCAL || 0}`);
          form.setValue("carb", `${food?.nutrients?.CHOCDF || 0}`);
          form.setValue("barcode", `N/A`);
          form.setValue("serving_size", `${measure?.weight}g`);
        });
    }
  }, [searchText]);

  async function onSubmit(values: z.infer<typeof foodSchema>) {
    await supabase.from("food_db").insert(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-6">
          <FormLabel>Search</FormLabel>
          <Input
            type="search"
            onBlur={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serving_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serving size</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identifier</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="calories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calories per serving</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="carb"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carbohydrates</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="protein"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Protein</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fat</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <DrawerClose> */}
        <div className="text-right mt-4">
          <Button type="submit">Submit</Button>
        </div>
        {/* </DrawerClose> */}
      </form>
    </Form>
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

        <section className="flex flex-wrap">
          <Drawer>
            <DrawerTrigger>
              <Button className="mr-2">Track XP</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="pb-8 mx-auto max-w-96" style={{ width: `100%` }}>
                <p className="mb-4">Integrations coming soon.</p>
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
          <Drawer>
            <DrawerTrigger>
              <Button variant="outline" className="mr-2">
                Track weight
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <AddWeight userConfig={userConfig} refetch={refetch} />
            </DrawerContent>
          </Drawer>
          <Drawer>
            <DrawerTrigger>
              <Button variant="outline" className="mr-2">
                Edit target
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <AddWeightTarget userConfig={userConfig} refetch={refetch} />
            </DrawerContent>
          </Drawer>
          <Sheet>
            <SheetTrigger>
              <Button variant="outline" className="xs:mt-2">
                Contribute Food Data
              </Button>
            </SheetTrigger>
            <SheetContent>
              <FoodForm />
            </SheetContent>
          </Sheet>
        </section>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {" "}
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
                    value={
                      (userConfig?.totalXP /
                        (5000 *
                          (parseFloat(userConfig?.weight) -
                            parseInt(
                              userConfig?.weight_loss_goal?.total,
                              10
                            )))) *
                      100
                    }
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
                <CardTitle className="text-sm font-medium">Macros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Protein:{" "}
                  {parseFloat(userConfig?.todaysTx?.protein || "0")?.toFixed(2)}
                  g
                </div>
                <div className="text-2xl font-bold">
                  Carbs:{" "}
                  {parseFloat(userConfig?.todaysTx?.carb || "0")?.toFixed(2)}g
                </div>
                <div className="text-2xl font-bold">
                  Fat:{" "}
                  {parseFloat(userConfig?.todaysTx?.fat || "0")?.toFixed(2)}g
                </div>
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
                    <Overview
                      userConfig={userConfig}
                      tx={tx}
                      type="ACTIVE"
                      chartType="BAR"
                    />
                  </TabsContent>
                  <TabsContent value="WEIGHT">
                    <Overview
                      userConfig={userConfig}
                      tx={tx}
                      type="WEIGHT"
                      chartType="LINE"
                    />
                  </TabsContent>
                  <TabsContent value="CONSUMPTION">
                    <Overview
                      userConfig={userConfig}
                      tx={tx}
                      type="CONSUMPTION"
                      chartType="BAR"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <DataTable
              tx={tx}
              AddActivity={AddActivity}
              userConfig={userConfig}
              refetch={refetch}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="grid gap-4 justify-center lg:grid-cols-2">
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
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Journey
        </div>
        <div className="relative z-20 items-center text-lg">
          <p>Everyone starts their journey somewhere.</p>
          <p>Fill out the information to the left.</p>
          <p>This will get your baseline in order.</p>
        </div>
      </div>
    </div>
  );
}

export default function Home({ userConfig, tx, refetch }) {
  return <AppView userConfig={userConfig} tx={tx} refetch={refetch} />;
}
