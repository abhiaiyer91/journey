import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  Bar,
  Line,
  LineChart,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export function Overview({ tx, type, chartType }) {
  let chartData = [];

  if (type === "CONSUMPTION") {
    chartData =
      tx?.map(({ created_at, consumptionXP }) => {
        return {
          total: parseInt(consumptionXP, 10),
          name: new Date(created_at).toISOString(),
        };
      }) || [];
  } else if (type === "ACTIVE") {
    chartData = tx?.map(({ created_at, activeXP }) => {
      return {
        name: created_at,
        total: activeXP,
      };
    });
  }

  const [serieData, setSerieData] = useState(chartData);

  let ChartComp = LineChart;

  if (chartType === `BAR`) {
    ChartComp = BarChart;
  }

  useEffect(() => {
    if (type === "WEIGHT") {
      supabase
        .from("weight_tracker")
        .select()
        .then(({ data }) => {
          const sd =
            data?.map(({ created_at, value }) => {
              return {
                total: parseInt(value, 10),
                name: new Date(created_at).toISOString(),
              };
            }) || [];

          if (sd?.length) {
            console.log({ sd });
            setSerieData(sd as any);
          }
        });
    }
  }, [type, chartType]);

  console.log(serieData);

  return (
    <ResponsiveContainer width="100%" height={350} className="mt-4">
      <ChartComp data={serieData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        {chartType === `BAR` ? (
          <Bar dataKey="total" fill="currentColor" className="fill-primary" />
        ) : null}
        {chartType === `LINE` ? (
          <Line dataKey="total" fill="currentColor" className="fill-primary" />
        ) : null}
      </ChartComp>
    </ResponsiveContainer>
  );
}
