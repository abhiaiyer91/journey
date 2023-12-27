import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

export default function Journal({ userConfig }) {
  const [journalText, setJournalText] = useState(``);
  const [journals, setJournals] = useState([]);

  function refetch() {
    supabase
      .from(`journal`)
      .select()
      .eq("user_id", userConfig?.id)
      .then(({ data }) => {
        if (data) {
          setJournals(data as any);
        }
      });
  }

  useEffect(() => {
    refetch();
  }, []);

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Button>Add new entry</Button>
        </SheetTrigger>
        <SheetContent>
          <CardHeader>
            <CardTitle>New journal entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-1.5">
              <Textarea
                value={journalText}
                onChange={(e) => {
                  setJournalText(e.target.value);
                }}
                placeholder="Type your message here."
                id="message"
                rows={20}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-right">
              <Button
                onClick={() => {
                  supabase
                    .from(`journal`)
                    .insert({
                      content: journalText,
                      user_id: userConfig?.id,
                    })
                    .then(() => {
                      refetch();
                    });
                }}
              >
                Submit
              </Button>
            </div>
          </CardFooter>
        </SheetContent>
      </Sheet>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {journals?.map((j) => {
          return (
            <Card>
              <CardHeader>
                <CardTitle>{formatDate(new Date(j?.created_at))}</CardTitle>
              </CardHeader>
              <CardContent>{j?.content}</CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
