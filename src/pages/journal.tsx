import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  energyToEmoji,
  focusToEmoji,
  moodToEmoji,
  sleepToEmoji,
  useCheckinStats,
  useJournalByDay,
  useSobrietyByDay,
} from "@/lib/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Journal({ userConfig }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { soberDays, nonSoberDays } = useCheckinStats({ userConfig });
  const { sobrietyCheckin, sobrietyRefetch } = useSobrietyByDay({
    date,
    userId: userConfig?.id,
  });

  const {
    journal,
    journalText,
    setJournalText,
    journalRefetch,
    mentalQs,
    setMentalQs,
  } = useJournalByDay({
    date,
    userId: userConfig?.id,
  });

  return (
    <section>
      <div className="flex mt-4">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow mr-2"
          />
        </div>
        <Card className="flex-1">
          <CardHeader></CardHeader>
          <CardContent>
            <div className="flex mb-4">
              <div className="mb-2 basis-2/3 pr-10">
                <h1 className="font-extrabold">Journal</h1>
                <p>
                  Journaling provides a constructive outlet for expressing
                  emotions and thoughts, reducing stress and promoting mental
                  well-being.
                </p>

                <ul className="list-disc list-inside">
                  <li>
                    <strong>Enhanced Self-Awareness</strong>: Regular reflection
                    through journaling fosters self-awareness, aiding personal
                    growth by identifying patterns, triggers, and areas for
                    improvement.
                  </li>
                  <li>
                    <strong>Improved Mental Health</strong>: Studies suggest
                    that journaling is linked to reduced symptoms of depression
                    and anxiety, contributing to overall mental health and
                    emotional well-being.
                  </li>
                </ul>

                <div className="text-right">
                  <Sheet>
                    <SheetTrigger>
                      <Button>
                        {journal?.content ? `Edit` : `Add new`} entry
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <CardHeader>
                        <CardTitle>New journal entry</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid w-full gap-1.5">
                          <h1>How was your day?</h1>
                          <ToggleGroup
                            size="lg"
                            type="single"
                            className="justify-start"
                            value={`${mentalQs[`mood`]}`}
                            onValueChange={(v) => {
                              setMentalQs({
                                ...mentalQs,
                                mood: v,
                              });
                            }}
                          >
                            <ToggleGroupItem value="0">😡</ToggleGroupItem>
                            <ToggleGroupItem value="1">😰</ToggleGroupItem>
                            <ToggleGroupItem value="2">😌</ToggleGroupItem>
                            <ToggleGroupItem value="3">😊</ToggleGroupItem>
                            <ToggleGroupItem value="4">😃</ToggleGroupItem>
                          </ToggleGroup>
                          <h1>How well did you sleep last night?</h1>
                          <ToggleGroup
                            size="lg"
                            type="single"
                            className="justify-start"
                            value={`${mentalQs[`sleep`]}`}
                            onValueChange={(v) => {
                              setMentalQs({
                                ...mentalQs,
                                sleep: v,
                              });
                            }}
                          >
                            <ToggleGroupItem value="0">😴</ToggleGroupItem>
                            <ToggleGroupItem value="1">🥱</ToggleGroupItem>
                            <ToggleGroupItem value="2">😑</ToggleGroupItem>
                            <ToggleGroupItem value="3">😊</ToggleGroupItem>
                            <ToggleGroupItem value="4">😃</ToggleGroupItem>
                          </ToggleGroup>
                          <h1>How would you rate your energy levels?</h1>
                          <ToggleGroup
                            size="lg"
                            type="single"
                            className="justify-start"
                            value={`${mentalQs[`energy`]}`}
                            onValueChange={(v) => {
                              setMentalQs({
                                ...mentalQs,
                                energy: v,
                              });
                            }}
                          >
                            <ToggleGroupItem value="0">⚡</ToggleGroupItem>
                            <ToggleGroupItem value="1">⚡⚡</ToggleGroupItem>
                            <ToggleGroupItem value="2">⚡⚡⚡</ToggleGroupItem>
                          </ToggleGroup>

                          <h1>How was your focus and motivation levels?</h1>
                          <ToggleGroup
                            size="lg"
                            type="single"
                            className="justify-start"
                            value={`${mentalQs[`focus`]}`}
                            onValueChange={(v) => {
                              setMentalQs({
                                ...mentalQs,
                                focus: v,
                              });
                            }}
                          >
                            <ToggleGroupItem value="0">🦾</ToggleGroupItem>
                            <ToggleGroupItem value="1">🦾🦾</ToggleGroupItem>
                            <ToggleGroupItem value="2">🦾🦾🦾</ToggleGroupItem>
                          </ToggleGroup>

                          <Textarea
                            value={journalText}
                            onChange={(e) => {
                              setJournalText(e.target.value);
                            }}
                            placeholder="Type your message here."
                            id="message"
                            rows={10}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="text-right">
                          <Button
                            onClick={() => {
                              supabase
                                .from("journal")
                                .select()
                                .eq("user_id", userConfig?.id)
                                .eq("created_at", formatDate(date))
                                .single()
                                .then(({ data }) => {
                                  if (!data) {
                                    return supabase
                                      .from(`journal`)
                                      .insert({
                                        content: journalText,
                                        user_id: userConfig?.id,
                                        created_at: formatDate(date),
                                        mood: parseInt(mentalQs[`mood`], 10),
                                        focus: parseInt(mentalQs[`focus`], 10),
                                        sleep: parseInt(mentalQs[`sleep`], 10),
                                        energy: parseInt(
                                          mentalQs[`energy`],
                                          10
                                        ),
                                      })
                                      .then(() => {
                                        journalRefetch();
                                      });
                                  } else {
                                    return supabase
                                      .from(`journal`)
                                      .update({
                                        content: journalText,
                                        mood: parseInt(mentalQs[`mood`], 10),
                                        focus: parseInt(mentalQs[`focus`], 10),
                                        sleep: parseInt(mentalQs[`sleep`], 10),
                                        energy: parseInt(
                                          mentalQs[`energy`],
                                          10
                                        ),
                                      })
                                      .eq("id", data?.id)
                                      .then(() => {
                                        journalRefetch();
                                      });
                                  }
                                })
                                .then(() => {
                                  supabase
                                    .from(`transaction`)
                                    .update({
                                      mood: parseInt(mentalQs[`mood`], 10),
                                      focus: parseInt(mentalQs[`focus`], 10),
                                      sleep: parseInt(mentalQs[`sleep`], 10),
                                      energy: parseInt(mentalQs[`energy`], 10),
                                    })
                                    .eq("user_id", userConfig?.id)
                                    .eq("created_at", formatDate(date))
                                    .then((d) => console.log(d));
                                });
                            }}
                          >
                            Submit
                          </Button>
                        </div>
                      </CardFooter>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <div className="basis-1/2">
                {journal ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {formatDate(new Date(journal?.created_at))}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        Mood: {moodToEmoji[journal?.mood]}
                      </div>
                      <div className="mb-2">
                        Focus: {focusToEmoji[journal?.focus]}
                      </div>
                      <div className="mb-2">
                        Sleep: {sleepToEmoji[journal?.sleep]}
                      </div>
                      <div className="mb-2">
                        Energy: {energyToEmoji[journal?.energy]}
                      </div>
                      {journal?.content}
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </div>
            <div className="flex">
              <div className="mb-2 basis-2/3 pr-10">
                <h1 className="font-extrabold">Sobriety</h1>
                <p>
                  Tracking sobriety on a daily basis offers individuals numerous
                  benefits in their journey towards controlling their
                  relationship with alcohol.
                </p>

                <ul className="list-disc list-inside">
                  <li>
                    <strong>Accountability and Motivation</strong>: Sobriety
                    tracking encourages individuals to stay accountable for
                    their decisions.
                  </li>
                  <li>
                    <strong>Progress Monitoring</strong>: Tracking sobriety
                    allows individuals to monitor and celebrate their progress.
                  </li>
                  <li>
                    <strong>Health Benefits</strong>: Sobriety can lead to
                    improved physical and mental health, including better sleep,
                    enhanced cognitive function, and a reduced risk of various
                    health issues associated with substance abuse.
                  </li>
                </ul>
                {sobrietyCheckin ? (
                  <Alert className="mt-4">
                    <AlertTitle>
                      {sobrietyCheckin?.sober
                        ? `Great job!`
                        : `One day at a time`}
                    </AlertTitle>
                    <AlertDescription>
                      {sobrietyCheckin?.sober
                        ? `Today is one more day that I abstained from alcohol/drug consumption.`
                        : `While I gave in to alcohol/drugs today. One day at a time. Tracking is the first step.`}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div>
                    <h1 className="mb-2">
                      No check in recorded for today.{" "}
                      <strong>Add one now</strong>
                    </h1>
                    <div className="flex">
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => {
                          supabase
                            .from("sobriety")
                            .upsert({
                              sober: true,
                              user_id: userConfig?.id,
                              created_at: formatDate(new Date(date as any)),
                            })
                            .then(() => {
                              sobrietyRefetch();
                            });
                        }}
                      >
                        Sober
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          supabase
                            .from("sobriety")
                            .upsert({
                              sober: false,
                              user_id: userConfig?.id,
                              created_at: formatDate(new Date(date as any)),
                            })
                            .then(() => {
                              sobrietyRefetch();
                            });
                        }}
                      >
                        Not Sober
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="basis-1/2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      All time results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{soberDays} Sober</div>
                    <div className="text-2xl font-bold">
                      {nonSoberDays} Not Sober
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
