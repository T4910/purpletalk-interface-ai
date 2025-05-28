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
import { Badge } from "@/components/ui/badge";
import SidebarButton from "@/components/SidebarButton";
import { TopNavUser } from "@/components/TopNavUser";
import { user } from "@/services/endpoints";
import Header from "@/components/Header";

const data = [
  { date: "Jun 3", price: 240000, previousPrice: 200000 },
  { date: "Jun 6", price: 300000, previousPrice: 220000 },
  { date: "Jun 9", price: 280000, previousPrice: 240000 },
  { date: "Jun 12", price: 320000, previousPrice: 250000 },
  { date: "Jun 15", price: 350000, previousPrice: 300000 },
  { date: "Jun 18", price: 400000, previousPrice: 350000 },
  { date: "Jun 21", price: 380000, previousPrice: 370000 },
  { date: "Jun 24", price: 420000, previousPrice: 380000 },
  { date: "Jun 27", price: 450000, previousPrice: 400000 },
  { date: "Jun 30", price: 430000, previousPrice: 410000 },
];

const properties = [
  {
    id: 1,
    name: "Luxury Villa",
    address: "123 Main St, Beverly Hills",
    price: "$1,250,000",
    status: "Active",
    type: "Residential",
  },
  {
    id: 2,
    name: "Downtown Apartment",
    address: "456 Park Ave, New York",
    price: "$750,000",
    status: "Active",
    type: "Residential",
  },
  {
    id: 3,
    name: "Suburban House",
    address: "789 Oak Dr, Seattle",
    price: "$550,000",
    status: "Pending",
    type: "Residential",
  },
  {
    id: 4,
    name: "Office Space",
    address: "101 Business Blvd, Chicago",
    price: "$900,000",
    status: "Active",
    type: "Commercial",
  },
  {
    id: 5,
    name: "Waterfront Condo",
    address: "202 Beach Rd, Miami",
    price: "$650,000",
    status: "Active",
    type: "Residential",
  },
];

export default function Dashboard() {
  const [view, setView] = React.useState<"grid" | "table">("table");

  return (
    <>
      <Header />

      <div className="container overflow-auto mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value="$1,250.00"
            change="+12.5%"
            trend="up"
            description="Visitors for the last 6 months"
            subtitle="Trending up this month"
          />
          <StatsCard
            title="New Customers"
            value="1,234"
            change="-20%"
            trend="down"
            description="Acquisition needs attention"
            subtitle="Down 20% this period"
          />
          <StatsCard
            title="Active Accounts"
            value="45,678"
            change="+12.5%"
            trend="up"
            description="Engagement exceed targets"
            subtitle="Strong user retention"
          />
          <StatsCard
            title="Growth Rate"
            value="4.5%"
            change="+4.5%"
            trend="up"
            description="Meets growth projections"
            subtitle="Steady performance"
          />
        </div> */}

        {/* Chart Section */}
        {/* <Card className="mt-6">
          <CardHeader>
            <CardTitle>Property Price Trends</CardTitle>
            <CardDescription>Total for the last 3 months</CardDescription>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                Last 3 months
              </Button>
              <Button variant="outline" size="sm">
                Last 30 days
              </Button>
              <Button variant="outline" size="sm">
                Last 7 days
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  price: {
                    label: "Price",
                    theme: {
                      light: "#2563eb",
                      dark: "#3b82f6",
                    },
                  },
                  previousPrice: {
                    label: "Previous Year",
                    theme: {
                      light: "#10b981",
                      dark: "#34d399",
                    },
                  },
                }}
              >
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorPrevPrice"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
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
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="previousPrice"
                    stroke="#4ade80"
                    fillOpacity={1}
                    fill="url(#colorPrevPrice)"
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#60a5fa"
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card> */}

        {/* Properties Table/Grid Section */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Favorite Properties</CardTitle>
              <CardDescription>Manage your saved properties</CardDescription>
            </div>
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(value) =>
                value && setView(value as "grid" | "table")
              }
            >
              <ToggleGroupItem value="table" aria-label="Toggle table view">
                <TableIcon className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Toggle grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent>
            {view === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        {property.name}
                      </TableCell>
                      <TableCell>{property.address}</TableCell>
                      <TableCell>{property.price}</TableCell>
                      <TableCell>{property.status}</TableCell>
                      <TableCell>{property.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Custom tooltip for the chart
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {  
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{payload[0].payload.date}</p>
        <p className="text-sm text-blue-500">
          Current: ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-sm text-green-500">
          Previous: ${payload[1].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

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
