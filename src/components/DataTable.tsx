import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export function DataTable({ userConfig, refetch, tx, AddActivity }) {
  return (
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
              <TableHead>Spec</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Consumed</TableHead>
              <TableHead>Total XP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {tx?.map((t) => {
                return (
                  <>
                    {" "}
                    <TableCell className="font-medium">
                      {formatDate(new Date(t.created_at))}
                    </TableCell>
                    <TableCell>{userConfig?.baseXP?.toFixed(2)}</TableCell>
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
  );
}
