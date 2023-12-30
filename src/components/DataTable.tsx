import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { moodToEmoji } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";

export function DataTable({ userConfig, refetch, tx, AddActivity }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Data</CardTitle>
      </CardHeader>

      <CardContent className="pl-2">
        <Tabs defaultValue="ACTIVE">
          <TabsList>
            <TabsTrigger value="ACTIVE">Net Calories</TabsTrigger>
            <TabsTrigger value="WEIGHT">Weight</TabsTrigger>
            <TabsTrigger value="CONSUMPTION">Sobriety</TabsTrigger>
            <TabsTrigger value="MOOD">Mood</TabsTrigger>
          </TabsList>
          <TabsContent value="MOOD">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Mood</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tx?.map((t) => {
                  if (typeof t?.mood === `undefined` || t?.mood === null) {
                    return null;
                  }
                  return (
                    <TableRow key={t?.id}>
                      {" "}
                      <TableCell className="font-medium">
                        {formatDate(new Date(t.created_at))}
                      </TableCell>
                      <TableCell>{moodToEmoji[t?.mood]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="ACTIVE">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Spec</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Consumed</TableHead>
                  <TableHead>Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tx?.map((t) => {
                  return (
                    <TableRow key={t?.id}>
                      {" "}
                      <TableCell className="font-medium">
                        {formatDate(new Date(t.created_at))}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US").format(
                          userConfig?.baseXP?.toFixed(2)
                        )}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US").format(t?.activeXP)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US").format(
                          t?.consumptionXP
                        )}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US").format(
                          parseFloat(userConfig?.baseXP?.toFixed(2)) +
                            parseInt(t?.activeXP || "0", 10) -
                            parseInt(t?.consumptionXP || "0", 10)
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
