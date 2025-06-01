"use client";

import { Fragment, useCallback, useMemo, useRef, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader as UITableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableStore, type Property } from "@/lib/store/table-store";
import { useModalStore } from "@/lib/store/modal-store";
import { getPriceValue } from "@/lib/utils/format-utils";
import TableHeader from "./table-header";
import TablePagination from "./table-pagination";
import PropertyDetailsModal from "./property-details-modal";
import TableColumnHeader from "./table-column-header";
import {
  ExpanderCell,
  CheckboxCell,
  TitleCell,
  AddressCell,
  PropertyTypeCell,
  ListingDateCell,
  BedroomCell,
  BathroomCell,
  PriceCell,
  ExpandedRowContent,
} from "./table-cells";
import SpinLoader from "../SpinLoader";
import { useFavoritePropertiesQuery as getFavPropertyService } from "@/services/provider/favProperties";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock hook for demonstration - replace with your actual React Query hook
function useFavoritePropertiesQuery() {
  const mockData: Property[] = [
    {
      id: 1,
      location: "Sangotedo, Ajah, Lagos",
      details_url:
        "https://nigeriapropertycentre.com/for-sale/houses/semi-detached-duplexes/lagos/ajah/sangotedo/2595961-luxury-5-bedrooms-semi-detached-duplex",
      image_url: "/placeholder.svg?height=400&width=600",
      title: "Luxury 5 Bedrooms Semi-Detached Duplex",
      description:
        "Luxury 5 Bedrooms Semi-Detached Duplex with modern amenities and spacious rooms. Features include a swimming pool, gym, 24/7 security, ample parking space, and backup generator. Perfect for families looking for comfort and luxury.",
      bedroom: 5,
      bathroom: 4,
      listing_time: "2024-01-15T10:30:00Z",
      amenities: [
        "Swimming Pool",
        "Gym",
        "Security",
        "Parking",
        "Generator",
        "Garden",
        "Balcony",
        "Air Conditioning",
      ],
      property_type: "Semi-Detached Duplex",
      contact: null,
      scraped_at: "2025-05-30T21:39:37.449577Z",
      price: "₦85,000,000",
      extra_data: {
        price: "₦85,000,000",
        title: "Luxury 5 Bedrooms Semi-Detached Duplex",
        bedroom: 5,
        listing: "2024-01-15T10:30:00Z",
        location: "Sangotedo, Ajah, Lagos",
        amenities: [
          "Swimming Pool",
          "Gym",
          "Security",
          "Parking",
          "Generator",
          "Garden",
          "Balcony",
          "Air Conditioning",
        ],
        bathrooms: 4,
        image_url: "/placeholder.svg?height=400&width=600",
        description:
          "Luxury 5 Bedrooms Semi-Detached Duplex with modern amenities and spacious rooms",
        details_url:
          "https://nigeriapropertycentre.com/for-sale/houses/semi-detached-duplexes/lagos/ajah/sangotedo/2595961-luxury-5-bedrooms-semi-detached-duplex",
        phonenumber: "+234 801 234 5678",
        property_type: "Semi-Detached Duplex",
      },
      initiator: "user",
    },
    {
      id: 2,
      location: "Victoria Island, Lagos",
      details_url: "https://example.com/property-2",
      image_url: "/placeholder.svg?height=400&width=600",
      title: "Modern 3 Bedroom Apartment",
      description:
        "Contemporary apartment with stunning city views and premium finishes. Located in the heart of Victoria Island with easy access to business districts.",
      bedroom: 3,
      bathroom: 3,
      listing_time: "2024-02-20T14:15:00Z",
      amenities: [
        "Elevator",
        "Security",
        "Parking",
        "Backup Power",
        "Ocean View",
        "Gym",
      ],
      property_type: "Apartment",
      contact: null,
      scraped_at: "2025-05-29T18:22:15.449577Z",
      price: "₦45,000,000",
      extra_data: {
        price: "₦45,000,000",
        title: "Modern 3 Bedroom Apartment",
        bedroom: 3,
        listing: "2024-02-20T14:15:00Z",
        location: "Victoria Island, Lagos",
        amenities: [
          "Elevator",
          "Security",
          "Parking",
          "Backup Power",
          "Ocean View",
          "Gym",
        ],
        bathrooms: 3,
        image_url: "/placeholder.svg?height=400&width=600",
        description:
          "Contemporary apartment with stunning city views and premium finishes",
        details_url: "https://example.com/property-2",
        phonenumber: "+234 802 345 6789",
        property_type: "Apartment",
      },
      initiator: "user",
    },
    {
      id: 3,
      location: "Ikoyi, Lagos",
      details_url: "https://example.com/property-3",
      image_url: "/placeholder.svg?height=400&width=600",
      title: "Executive 4 Bedroom Terrace",
      description:
        "Spacious terrace house in the prestigious Ikoyi area with modern fittings and beautiful garden space.",
      bedroom: 4,
      bathroom: 5,
      listing_time: "2024-03-10T09:00:00Z",
      amenities: [
        "Garden",
        "Security",
        "Parking",
        "Swimming Pool",
        "Playground",
      ],
      property_type: "Terrace",
      contact: null,
      scraped_at: "2025-05-28T12:15:22.449577Z",
      price: "₦120,000,000",
      extra_data: {
        price: "₦120,000,000",
        title: "Executive 4 Bedroom Terrace",
        bedroom: 4,
        listing: "2024-03-10T09:00:00Z",
        location: "Ikoyi, Lagos",
        amenities: [
          "Garden",
          "Security",
          "Parking",
          "Swimming Pool",
          "Playground",
        ],
        bathrooms: 5,
        image_url: "/placeholder.svg?height=400&width=600",
        description: "Spacious terrace house in the prestigious Ikoyi area",
        details_url: "https://example.com/property-3",
        phonenumber: "+234 803 456 7890",
        property_type: "Terrace",
      },
      initiator: "user",
    },
  ];

  const { data, isPending } = getFavPropertyService();
  const moctData = data?.map(({ property }) => property);

  return {
    data: moctData,
    isPending,
  };
}

export default function PropertyFavoritesTable() {
  const { data: properties = [], isPending } = useFavoritePropertiesQuery();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Get state from Zustand stores
  const globalFilter = useTableStore((state) => state.globalFilter);
  const sorting = useTableStore((state) => state.sorting);
  const pageIndex = useTableStore((state) => state.pageIndex);
  const pageSize = useTableStore((state) => state.pageSize);
  const selectedRowIds = useTableStore((state) => state.selectedRowIds);
  const expandedRowIds = useTableStore((state) => state.expandedRowIds);
  const setSorting = useTableStore((state) => state.setSorting);
  const setPageIndex = useTableStore((state) => state.setPageIndex);
  const toggleRowSelection = useTableStore((state) => state.toggleRowSelection);
  const toggleAllRows = useTableStore((state) => state.toggleAllRows);
  const resetRowSelection = useTableStore((state) => state.resetRowSelection);
  const toggleRowExpansion = useTableStore((state) => state.toggleRowExpansion);

  const { openPropertyModal } = useModalStore();

  // Memoize column definitions
  const columnHelper = createColumnHelper<Property>();
  const columns = useMemo(
    () =>
      isMobile
        ? [
            // Select column
            columnHelper.display({
              id: "select",
              header: ({ table }) => {
                const allRowIds = table.getRowModel().rows.map((row) => row.id);
                const isAllSelected =
                  allRowIds.length > 0 &&
                  allRowIds.every((id) => selectedRowIds[id]);
                const isSomeSelected = allRowIds.some(
                  (id) => selectedRowIds[id]
                );

                return (
                  <CheckboxCell
                    checked={isAllSelected}
                    indeterminate={!isAllSelected && isSomeSelected}
                    onCheckedChange={(checked) =>
                      toggleAllRows(allRowIds, checked)
                    }
                  />
                );
              },
              cell: ({ row }) => (
                <CheckboxCell
                  checked={!!selectedRowIds[row.id]}
                  onCheckedChange={() => toggleRowSelection(row.id)}
                />
              ),
            }),
            // Title column
            columnHelper.accessor("title", {
              header: "Title",
              cell: ({ row }) => (
                <TitleCell
                  title={row.getValue("title")}
                  onOpenModal={() => openPropertyModal(row.original)}
                  isMobile={isMobile}
                />
              ),
            }),
            // Expander column
            columnHelper.display({
              id: "expander",
              header: () => null,
              cell: ({ row }) => (
                <ExpanderCell
                  isExpanded={!!expandedRowIds[row.id]}
                  onToggle={() => toggleRowExpansion(row.id)}
                />
              ),
            }),
          ]
        : [
            // Expander column
            columnHelper.display({
              id: "expander",
              header: () => null,
              cell: ({ row }) => (
                <ExpanderCell
                  isExpanded={!!expandedRowIds[row.id]}
                  onToggle={() => toggleRowExpansion(row.id)}
                />
              ),
            }),

            // Select column
            columnHelper.display({
              id: "select",
              header: ({ table }) => {
                const allRowIds = table.getRowModel().rows.map((row) => row.id);
                const isAllSelected =
                  allRowIds.length > 0 &&
                  allRowIds.every((id) => selectedRowIds[id]);
                const isSomeSelected = allRowIds.some(
                  (id) => selectedRowIds[id]
                );

                return (
                  <CheckboxCell
                    checked={isAllSelected}
                    indeterminate={!isAllSelected && isSomeSelected}
                    onCheckedChange={(checked) =>
                      toggleAllRows(allRowIds, checked)
                    }
                  />
                );
              },
              cell: ({ row }) => (
                <CheckboxCell
                  checked={!!selectedRowIds[row.id]}
                  onCheckedChange={() => toggleRowSelection(row.id)}
                />
              ),
            }),

            // Title column
            columnHelper.accessor("title", {
              header: "Title",
              cell: ({ row }) => (
                <TitleCell
                  title={row.getValue("title")}
                  onOpenModal={() => openPropertyModal(row.original)}
                />
              ),
            }),

            // Address column
            columnHelper.accessor("location", {
              header: "Address",
              cell: ({ row }) => (
                <AddressCell location={row.getValue("location")} />
              ),
            }),

            // Property Type column
            columnHelper.accessor("property_type", {
              header: "Property Type",
              cell: ({ row }) => (
                <PropertyTypeCell type={row.getValue("property_type")} />
              ),
            }),

            // Listing Date column
            columnHelper.accessor("listing_time", {
              header: "Listed",
              cell: ({ row }) => (
                <ListingDateCell
                  listingTime={
                    row.original.extra_data.listing || row.original.listing_time
                  }
                />
              ),
              sortingFn: "datetime",
            }),

            // Bedrooms column
            columnHelper.accessor("bedroom", {
              header: "Bedrooms",
              cell: ({ row }) => (
                <BedroomCell bedrooms={row.getValue("bedroom")} />
              ),
            }),

            // Bathrooms column
            columnHelper.accessor("bathroom", {
              header: "Bathrooms",
              cell: ({ row }) => {
                const bathrooms =
                  row.original.bathroom || row.original.extra_data.bathrooms;
                return <BathroomCell bathrooms={bathrooms} />;
              },
            }),

            // Price column
            columnHelper.accessor("price", {
              header: "Price",
              cell: ({ row }) => {
                const price =
                  row.original.price || row.original.extra_data.price;
                return <PriceCell price={price} />;
              },
              sortingFn: (rowA, rowB) => {
                const priceA =
                  rowA.original.price || rowA.original.extra_data.price || "0";
                const priceB =
                  rowB.original.price || rowB.original.extra_data.price || "0";
                return getPriceValue(priceA) - getPriceValue(priceB);
              },
            }),
          ],
    [
      columnHelper,
      selectedRowIds,
      expandedRowIds,
      toggleRowSelection,
      toggleAllRows,
      toggleRowExpansion,
      openPropertyModal,
      isMobile,
    ]
  );

  // Create table instance with manual state management
  const table = useReactTable({
    data: properties,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater({ pageIndex, pageSize });
        setPageIndex(newPagination.pageIndex);
      }
    },
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    enableRowSelection: false, // We handle this manually
    manualPagination: false,
    debugTable: true,
  });

  // Handle delete selected rows
  const handleDeleteSelected = useCallback(() => {
    const selectedIds = Object.keys(selectedRowIds);
    console.log("Deleting selected properties:", selectedIds);
    resetRowSelection();
  }, [selectedRowIds, resetRowSelection]);

  // Handle delete single property
  const handleDeleteProperty = useCallback((id: number) => {
    console.log("Deleting property:", id);
  }, []);

  // Handle refresh property
  const handleRefreshProperty = useCallback(async (id: number) => {
    console.log("Refreshing property:", id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [pageIndex]);

  if (isPending) {
    return (
      <div className="bg-transparent rounded-lg p-8 text-center grid place-items-center">
        <div className="text-slate-400 flex items-center gap-0.5">
          <span>Loading properties...</span>
          <SpinLoader />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        // className=""
        className="rounded-lg border shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card"
      >
        {/* Table Header with Search and Delete Button */}
        <TableHeader
          onDeleteSelected={handleDeleteSelected}
          totalRows={properties.length}
        />

        {/* Table */}
        <div className="overflow-x-auto max-wxl w-full" ref={tableContainerRef}>
          <Table>
            {!isMobile && (
              <UITableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent "
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-slate-300 font-medium"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {/* {header.getContext()} */}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </UITableHeader>
            )}
            <TableBody className="max-w-full mx-auto overflow-x-hidden">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow
                      data-state={
                        selectedRowIds[row.id] ? "selected" : undefined
                      }
                      className="  hover:bg-slate-800/30 data-[state=selected]:bg-slate-800"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="whitespace-nowrap [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedRowIds[row.id] && (
                      <TableRow className="">
                        <TableCell
                          colSpan={columns.length}
                          className="bg-slate-800/30"
                        >
                          <ExpandedRowContent property={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-slate-400"
                  >
                    <span>No properties found.</span>
                    <SpinLoader />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {/* <TablePagination
          totalRows={table.getFilteredRowModel().rows.length}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
        /> */}
      </div>

      {/* Property Details Modal */}
      <PropertyDetailsModal
        onDelete={handleDeleteProperty}
        onRefresh={handleRefreshProperty}
      />
    </>
  );
}
