"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  //   type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  //   arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  FilterIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// DragHandle component for row reordering
function DragHandle({ id }: { id: string | number }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="cursor-grab size-8 p-0 text-muted-foreground hover:text-foreground"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="19" r="1" />
      </svg>
      <span className="sr-only">Reorder row</span>
    </Button>
  );
}

// DraggableRow component for drag and drop functionality
function DraggableRow<T>({
  row,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  children: React.ReactNode;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      className="group transition-all hover:bg-muted/50 data-[dragging=true]:opacity-70 data-[dragging=true]:shadow-md data-[state=selected]:bg-muted/50"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {children}
    </TableRow>
  );
}

type DataTableWrapperProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pageSize?: number;
  enableRowSelection?: boolean;
  enableDragAndDrop?: boolean;
  enableColumnFiltering?: boolean;
};

// Main DataTable component
export function DataTableWrapper<TData>({
  columns,
  data,
  enableRowSelection = true,
  enableDragAndDrop = true,
  enableColumnFiltering = true,
}: DataTableWrapperProps<TData>) {
  // State for the table and data
  //   const [data, setData] = React.useState<TData[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Create a unique ID for the sortable context
  const sortableId = React.useId();

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Create an array of IDs for drag and drop
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (data as any[])?.map((item) => item.id) || [],
    [data]
  );

  // Set up the table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    // globalFilterFn: "contains",
  });

  // Handle drag and drop
  //   function handleDragEnd(event: DragEndEvent) {
  //     const { active, over } = event;

  //     if (active && over && active.id !== over.id) {
  //       setData((items) => {
  //         const oldIndex = dataIds.indexOf(active.id);
  //         const newIndex = dataIds.indexOf(over.id);
  //         return arrayMove([...items], oldIndex, newIndex);
  //       });
  //     }
  //   }

  // before your JSX:
  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;

  const paginationInfo = React.useMemo(() => {
    const firstRowNum = pageIndex * pageSize + 1;
    const lastRowNum = Math.min((pageIndex + 1) * pageSize, filteredRowCount);
    return `${firstRowNum}-${lastRowNum} of ${filteredRowCount}`;
  }, [filteredRowCount, pageIndex, pageSize]);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {enableColumnFiltering && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <FilterIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 p-3">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter data</h4>
                  <div className="space-y-2">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanFilter())
                      .map((column) => {
                        return (
                          <div key={column.id} className="space-y-1">
                            <Label
                              htmlFor={`filter-${column.id}`}
                              className="text-xs"
                            >
                              {column.id.charAt(0).toUpperCase() +
                                column.id.slice(1)}
                            </Label>
                            <Input
                              id={`filter-${column.id}`}
                              placeholder={`Filter by ${column.id}`}
                              value={(column.getFilterValue() as string) ?? ""}
                              onChange={(e) =>
                                column.setFilterValue(e.target.value)
                              }
                              className="h-8"
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <SlidersHorizontalIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
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
                      {column.id
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={enableDragAndDrop ? [restrictToVerticalAxis] : []}
          // onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <div className="relative overflow-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center gap-1 ${
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="ml-1">
                                {{
                                  asc: <ChevronDownIcon className="h-4 w-4" />,
                                  desc: (
                                    <ChevronDownIcon className="h-4 w-4 rotate-180" />
                                  ),
                                }[header.column.getIsSorted() as string] ?? (
                                  <ChevronDownIcon className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  enableDragAndDrop ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="px-4 py-2.5">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </DraggableRow>
                      ))}
                    </SortableContext>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-muted/50 data-[state=selected]:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="px-4 py-2.5">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DndContext>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Badge variant="outline" className="mr-2 font-normal">
              {table.getFilteredSelectedRowModel().rows.length} selected
            </Badge>
          )}
          <span className="hidden sm:inline">{paginationInfo}</span>
        </div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <div className="flex items-center gap-1">
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-18 border-muted">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 sm:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="flex h-8 items-center justify-center px-2 text-sm">
              <span className="sm:hidden">{paginationInfo}</span>
              <span className="hidden sm:inline">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 sm:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Function to create a draggable column
export function createDraggableColumn<T>() {
  return {
    id: "drag",
    enableHiding: false,
    enableSorting: false,
    size: 40,
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  } as ColumnDef<T>;
}

// Function to create a row selection column
export function createSelectionColumn<T>() {
  return {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    size: 40,
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      </div>
    ),
  } as ColumnDef<T>;
}

// Function to create an actions column
export function createActionsColumn<T>({
  actions,
}: {
  actions: React.ReactNode;
}) {
  return {
    id: "actions",
    enableHiding: false,
    size: 40,
    cell: () => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-50 hover:opacity-100"
            >
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {actions}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  } as ColumnDef<T>;
}
