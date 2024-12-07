"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { brand: "sony", sales: 3275, fill: "#0066CC" }, // Sony blue
  { brand: "canon", sales: 3100, fill: "#D30000" }, // Canon red
  { brand: "nikon", sales: 2870, fill: "#FFB900" }, // Nikon yellow
  { brand: "fujifilm", sales: 1730, fill: "#00AB6C" }, // Fujifilm green
  { brand: "panasonic", sales: 1450, fill: "#808080" }, // Panasonic grey
];

const chartConfig = {
  sales: {
    label: "Sales",
  },
  sony: {
    label: "Sony",
    color: "rgb(0, 102, 204)",
  },
  canon: {
    label: "Canon",
    color: "rgb(211, 0, 0)",
  },
  nikon: {
    label: "Nikon",
    color: "rgb(255, 185, 0)",
  },
  fujifilm: {
    label: "Fujifilm",
    color: "rgb(0, 171, 108)",
  },
  panasonic: {
    label: "Panasonic",
    color: "rgb(128, 128, 128)",
  },
} satisfies ChartConfig;

export function CameraBrandsChart() {
  const totalSales = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.sales, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Camera Brand Sales</CardTitle>
        <CardDescription>All time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="sales"
              nameKey="brand"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="invert text-3xl font-bold"
                        >
                          {totalSales.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="invert"
                        >
                          Units Sold
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Market growth +3.8% YoY <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default CameraBrandsChart;
