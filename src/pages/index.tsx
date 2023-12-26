"use client";
import React, { useEffect } from "react";
import { AxisOptions } from "react-charts";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { createClient } from "@supabase/supabase-js";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import "react-tabs/style/react-tabs.css";
import { useState } from "react";
import dynamic from "next/dynamic";

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

type Series = {
  label: string;
  data: any[];
};

function WeightChart() {
  const [serieData, setSerieData] = useState([] as any);

  useEffect(() => {
    supabase
      .from("weight_tracker")
      .select()
      .then(({ data }) => {
        const sD = [
          {
            label: "Weight",
            data:
              data?.map(({ created_at, value }) => {
                return {
                  value: parseInt(value, 10),
                  date: new Date(created_at).toDateString(),
                };
              }) || [],
          },
        ];

        setSerieData(sD);
      });
  });

  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum: any) => datum.date,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum: any) => parseInt(datum.value, 10),
        elementType: `line`,
      },
    ],
    []
  );

  if (!serieData?.length) {
    return null;
  }

  return (
    <section style={{ height: `200px` }} className="mb-10">
      <h1 className="text-lg font-extrabold">Viz</h1>
      <Chart
        id="CHART"
        options={{
          data: serieData,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </section>
  );
}

const userId = `1`;

// Create a single supabase client for interacting with your database

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

function TDEEForm({ form, metric_type, setTD }) {
  return (
    <>
      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
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
          <FormItem>
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
          <FormItem>
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
      <h2>Basic Information</h2>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
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
          <FormItem>
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
          <FormItem>
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

function TDEECalculator({ form, tde, setTD }) {
  return (
    <section>
      <div>
        <Tabs
          onSelect={(event) => {
            form.setValue("type", event === 0 ? "IMPERIAL" : "METRIC");
          }}
        >
          <TabList>
            <Tab>Imperial</Tab>
            <Tab>Metric</Tab>
          </TabList>

          <TabPanel>
            <TDEEForm form={form} setTD={setTD} metric_type="IMPERIAL" />
          </TabPanel>
          <TabPanel>
            <TDEEForm form={form} setTD={setTD} metric_type="METRIC" />
          </TabPanel>
        </Tabs>
      </div>
    </section>
  );
}

function Fitness({ userConfig }) {
  // Fetch Apple HealthKit Data
  // TDEE CALCULATOR
  // CALORIES PER LB OF FAT
  // MFP or
  // Calendar
  // TOTAL REMAINING

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
      height: `${userConfig?.height}`,
      weight: `${userConfig?.weight}`,
      age: `${userConfig?.age}`,
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
        id: userId,
        tdee: result * activityMultiplier[values.activity],
        baseXP: result * activityMultiplier[values.activity] - 500,
      })
      .then(({ data, error }) => {
        console.log(error, data);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfo form={form} />
        <TDEECalculator tde={tde} setTD={setTD} form={form} />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

enum AppMode {
  FITNESS = "FITNESS",
  HYDRATION = "HYDRATION",
  FINANCE = "FINANCE",
  DASHBOARD = "DASHBOARD",
}

function AddWeight() {
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
      type: "IMPERIAL",
      value: values.value,
    });

    await supabase
      .from("user_config")
      .update({
        weight: parseFloat(values?.value),
      })
      .eq("id", userId);
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

function AddWeightTarget() {
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
      .eq("user_id", userId)
      .single();

    await supabase.from("weight_loss_goal").upsert({
      created_at: start.toUTCString(),
      ...transaction?.data,
      description: `Weight loss goal`,
      user_id: userId,
      total: values.value,
    });
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

function ActivityActiveState({ onFinish, disableHeader = false }) {
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
      .eq("created_at", start.toUTCString())
      .single();

    let updateOb = {};
    if (!transaction?.data) {
      if (values.type === "ACTIVE_CAL") {
        updateOb = { activeXP: values.value };
      } else {
        updateOb = { consumptionXP: values.value };
      }

      return supabase
        .from("transaction")
        .upsert({
          created_at: start.toUTCString(),
          ...transaction?.data,
          ...updateOb,
        })
        .then((d) => console.log(d));
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
  }
  return (
    <Card>
      <CardHeader>
        {!disableHeader && <CardTitle>Add Activity</CardTitle>}
      </CardHeader>

      <CardContent>
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

            <div className="text-right">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function AddActivity() {
  const [active, setActive] = useState(false);
  return (
    <>
      <CardDescription className="text-right">
        {" "}
        <button
          onClick={() => {
            setActive(!active);
          }}
        >
          Add Activity
        </button>
      </CardDescription>
      {active ? (
        <ActivityActiveState
          onFinish={() => {
            setActive(false);
          }}
        />
      ) : null}
    </>
  );
}

function AppView({
  activeState,
  tx,
  userConfig,
}: {
  userConfig: any;
  activeState: AppMode;
}) {
  const [toggleEdit, setToggleEdit] = useState(false);

  if (userConfig?.name) {
    return (
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Welcome back {userConfig?.name}!</CardTitle>
            <CardDescription>
              {" "}
              <button
                onClick={() => {
                  setToggleEdit(!toggleEdit);
                }}
              >
                Edit profile
              </button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {toggleEdit ? <Fitness userConfig={userConfig} /> : null}
            <section className="mb-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Current</TableHead>
                    <TableHead className="w-[100px]">Target</TableHead>
                    <TableHead className="w-[100px]">Remaining</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {userConfig?.weight?.toFixed(2)}
                      {userConfig?.metric_type === `IMPERIAL` ? `lbs` : `kg`}
                    </TableCell>
                    <TableCell className="font-medium">
                      {userConfig?.weight_loss_goal?.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {parseFloat(userConfig?.weight) -
                        parseInt(
                          userConfig?.weight_loss_goal?.total.toFixed(2),
                          10
                        )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">TDEE</TableHead>
                    <TableHead className="w-[100px]">Base XP</TableHead>
                    <TableHead className="w-[100px]">XP Total</TableHead>
                    <TableHead className="w-[100px]">% Complete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {userConfig?.tdee?.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {userConfig?.baseXP?.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {userConfig?.totalXP} /
                      {5000 *
                        (parseFloat(userConfig?.weight) -
                          parseInt(
                            userConfig?.weight_loss_goal?.total.toFixed(2),
                            10
                          ))}
                    </TableCell>
                    <TableCell className="font-medium">
                      {(
                        (userConfig?.totalXP /
                          (5000 *
                            (parseFloat(userConfig?.weight) -
                              parseInt(
                                userConfig?.weight_loss_goal?.total.toFixed(2),
                                10
                              )))) *
                        100
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            <div className="mb-8">
              <h1 className="text-lg font-extrabold">How it works</h1>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-0">
                  <AccordionTrigger>Add a weight target</AccordionTrigger>
                  <AccordionContent>
                    <AddWeightTarget />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Record your weight daily</AccordionTrigger>
                  <AccordionContent>
                    <AddWeight />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Track XP</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">Integrations coming soon.</p>
                    <ActivityActiveState
                      disableHeader
                      onFinish={() => {
                        // setActive(false);
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="mt-8 mb-8">
              <h1 className="text-lg font-extrabold">Tracker</h1>

              <AddActivity />

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
                            {new Date(t.created_at)?.toLocaleDateString(
                              "en-us",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
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
            </div>
            <WeightChart />
          </CardContent>
        </Card>
      </section>
    );
  }

  return <Fitness userConfig={userConfig} />;
}

export default function Home() {
  const [activeState, setActiveState] = useState<AppMode>(AppMode.DASHBOARD);
  const [userConfig, setUserConfig] = useState({});
  const [tx, setTx] = useState([]);

  const getUserConfig = async () => {
    const { data, error } = await supabase
      .from("user_config")
      .select()
      .single();

    const result = await supabase
      .from("weight_loss_goal")
      .select()
      .eq("user_id", userId)
      .single();

    const tx = await supabase.from("transaction").select();

    const totalCal = tx?.data?.map(({ activeXP, consumptionXP }) => {
      return (
        parseInt(data?.baseXP, 10) +
        parseInt(activeXP, 10) -
        parseInt(consumptionXP, 10)
      );
    });

    return {
      ...data,
      weight_loss_goal: result?.data,
      totalXP: totalCal?.reduce((partialSum, a) => partialSum + a, 0),
    };
  };

  const transactions = async () => {
    const { data, error } = await supabase.from("transaction").select();

    return data;
  };

  useEffect(() => {
    getUserConfig().then((data) => {
      setUserConfig(data);
    });

    transactions().then((data) => {
      if (data) {
        setTx(data);
      }
    });
  }, []);

  return (
    <main className="max-w-xl mx-auto">
      <section>
        <div>
          <div className="text-center mt-5 mb-10">
            <h1 className="text-lg text-3xl font-bold">Welcome to Journey</h1>
            <p>Journey helps manage and track your goals.</p>
          </div>

          <AppView activeState={activeState} userConfig={userConfig} tx={tx} />
        </div>
      </section>
    </main>
  );
}
