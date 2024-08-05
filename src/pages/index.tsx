import React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";


import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [router]);

  return null;
};



import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data: BusSchedule[] = [
  {
    routeId: 1,
    routeTitle: "Route 33",
    serviceCode: "A",
    stopAddress: "123 Example St, Dunedin",
    departureTime: "08:00 AM",
    status: "on time",
  },
  {
    routeId: 2,
    routeTitle: "Route 34",
    serviceCode: "B",
    stopAddress: "456 Sample Rd, Dunedin",
    departureTime: "09:30 AM",
    status: "delayed",
  },
  {
    routeId: 3,
    routeTitle: "Route 35",
    serviceCode: "C",
    stopAddress: "789 Demo Blvd, Dunedin",
    departureTime: "10:00 AM",
    status: "on time",
  },
  {
    routeId: 4,
    routeTitle: "Route 36",
    serviceCode: "D",
    stopAddress: "321 Test Ave, Dunedin",
    departureTime: "11:00 AM",
    status: "cancelled",
  },
  {
    routeId: 5,
    routeTitle: "Route 37",
    serviceCode: "E",
    stopAddress: "654 Example Ct, Dunedin",
    departureTime: "12:00 PM",
    status: "on time",
  },
];

export type BusSchedule = {
  routeId: number;
  routeTitle: string;
  serviceCode: string;
  stopAddress: string;
  departureTime: string;
  status: "on time" | "delayed" | "cancelled";
};

export const columns: ColumnDef<BusSchedule>[] = [
  {
    accessorKey: "routeTitle",
    header: "Route Title",
    cell: ({ row }) => <div>{row.getValue("routeTitle")}</div>,
  },
  {
    accessorKey: "serviceCode",
    header: "Service Code",
    cell: ({ row }) => <div>{row.getValue("serviceCode")}</div>,
  },
  {
    accessorKey: "stopAddress",
    header: "Stop Address",
    cell: ({ row }) => <div>{row.getValue("stopAddress")}</div>,
  },
  {
    accessorKey: "departureTime",
    header: "Departure Time",
    cell: ({ row }) => <div>{row.getValue("departureTime")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const schedule = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(schedule.routeId.toString())}
            >
              Copy Route ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View route details</DropdownMenuItem>
            <DropdownMenuItem>View bus status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Home: React.FC = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-500 mb-8">
        Bus Timetable v1
      </h1>
      <div className="w-full max-w-4xl  ">
        <div className="flex items-center py-4 ">
          <Input
            placeholder="Filter routes..."
            value={(table.getColumn("routeTitle")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("routeTitle")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

