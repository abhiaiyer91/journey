import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

export default function Sobriety({ userConfig }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeCheckin, setActiveCheckIn] = useState<any>();
  const [checkins, setActiveCheckIns] = useState([]);

  // const [journalText, setJournalText] = useState(``);
  // const [journals, setJournals] = useState([]);

  function refetch() {
    supabase
      .from(`sobriety`)
      .select()
      .eq("user_id", userConfig?.id)
      .eq("created_at", formatDate(new Date(date as any)))
      .single()
      .then(({ data }) => {
        if (data) {
          setActiveCheckIn(data as any);
        } else {
          setActiveCheckIn(undefined);
        }
      });
  }

  useEffect(() => {
    refetch();
  }, [date]);

  useEffect(() => {
    supabase
      .from(`sobriety`)
      .select()
      .eq("user_id", userConfig?.id)
      .then(({ data }) => {
        if (data) {
          setActiveCheckIns(data as any);
        }
      });
  }, []);

  const soberDays = checkins
    ?.map(({ sober }) => {
      return sober ? 1 : 0;
    })
    ?.reduce((partialSum, a) => partialSum + a, 0);

  const nonSoberDays = checkins
    ?.map(({ sober }) => {
      return sober ? 0 : 1;
    })
    ?.reduce((partialSum, a) => partialSum + a, 0);

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Sobriety</h1>
      <p>
        Tracking sobriety on a daily basis offers individuals numerous benefits
        in their journey towards controlling their relationship with Alchohol.
      </p>
      <ul className="list-disc list-inside">
        <li>
          Firstly, it provides a tangible and visual representation of progress
        </li>
        <li>
          Tracking helps identify patterns and triggers, enabling individuals to
          develop effective coping strategies and address potential pitfalls
        </li>
        <li>
          {`Connsistent tracking can serve as a powerful testament to one's
          resilience and determination`}
        </li>
      </ul>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soberDays} Sober</div>
            <div className="text-2xl font-bold">{nonSoberDays} Not Sober</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex mt-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow mr-2"
        />
        <Card className="flex-1">
          <CardHeader></CardHeader>
          <CardContent>
            {activeCheckin ? (
              <h1>
                {" "}
                Checked in as {activeCheckin?.sober ? `SOBER` : `NOT SOBER`}
              </h1>
            ) : (
              <div>
                <h1 className="mb-2">No check in for today. Add one now</h1>
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
                          refetch();
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
                          refetch();
                        });
                    }}
                  >
                    Not Sober
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
