import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import Header from "@/components/Header";
import { useFavoritePropertiesQuery } from "@/services/provider/favProperties";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import FavoritePropertiesTable from "@/components/property-favorites-table/property-favorites-table";
// import FavoritePropertiesTable from "@/components/FavoritePropertiesTable2";
import SpinLoader from "@/components/SpinLoader";

// const data = [
//   { date: "Jun 3", price: 240000, previousPrice: 200000 },
//   { date: "Jun 6", price: 300000, previousPrice: 220000 },
//   { date: "Jun 9", price: 280000, previousPrice: 240000 },
//   { date: "Jun 12", price: 320000, previousPrice: 250000 },
//   { date: "Jun 15", price: 350000, previousPrice: 300000 },
//   { date: "Jun 18", price: 400000, previousPrice: 350000 },
//   { date: "Jun 21", price: 380000, previousPrice: 370000 },
//   { date: "Jun 24", price: 420000, previousPrice: 380000 },
//   { date: "Jun 27", price: 450000, previousPrice: 400000 },
//   { date: "Jun 30", price: 430000, previousPrice: 410000 },
// ];

export default function Dashboard() {
  // const [view, setView] = React.useState<"grid" | "table">("table");
  const { data, error } = useFavoritePropertiesQuery();
  console.log("Properties data on dashboard: ", data, error);

  return (
    <>
      <Header />

      <div className="container overflow-auto mx-auto max-md:px-3 p-6 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <React.Suspense
          fallback={
            <div className="h-20 grid place-items-center">
              <SpinLoader className="size-12" />
            </div>
          }
        >
          <SectionCards />
        </React.Suspense>

        {/* Chart Section */}
        {/* <React.Suspense
          fallback={
            <div className="h-20 grid place-items-center">
              <SpinLoader className="size-12" />
            </div>
          }
        >
          <ChartAreaInteractive />
        </React.Suspense> */}

        {/* Properties Table/Grid Section */}
        <FavoritePropertiesTable />
      </div>
    </>
  );
}

// // Custom tooltip for the chart
// const CustomTooltip: React.FC<any> = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
//         <p className="text-sm font-medium">{payload[0].payload.date}</p>
//         <p className="text-sm text-blue-500">
//           Current: ${payload[0].value.toLocaleString()}
//         </p>
//         <p className="text-sm text-green-500">
//           Previous: ${payload[1].value.toLocaleString()}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  subtitle: string;
  description: string;
}

const StatsCard = ({
  title,
  value,
  change,
  trend,
  subtitle,
  description,
}: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className={`px-2 py-1 rounded-md text-xs flex items-center ${
              trend === "up"
                ? "bg-green-500/20 text-green-700"
                : "bg-red-500/20 text-red-700"
            }`}
          >
            {trend === "up" ? (
              <ArrowUp className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDown className="mr-1 h-3 w-3" />
            )}
            {change}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs font-medium mt-1">{subtitle}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

// Property Card Component
interface PropertyProps {
  property: {
    id: number;
    name: string;
    address: string;
    price: string;
    status: string;
    type: string;
  };
}

const PropertyCard = ({ property }: PropertyProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{property.name}</CardTitle>
        <CardDescription>{property.address}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-medium">{property.price}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{property.status}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{property.type}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
