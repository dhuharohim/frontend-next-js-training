"use client";

import { DataTableWrapper } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { fetchGet } from "@/lib/client";
import { Book, BooksSchema } from "@/types/models/books";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Link, Trash2 } from "lucide-react";
import React from "react";

export default function BookListPage() {
  const [books, setBooks] = React.useState<Book[]>([]);
  const columns: ColumnDef<Book>[] = [
    {
      accessorKey: "No",
      cell: ({ row }) => {
        return <div className="flex items-center">{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="p-0 hover:bg-transparent"
            >
              Title
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "author",
      header: ({ column }) => {
        return (
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="p-0 hover:bg-transparent"
            >
              Author
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="p-0 hover:bg-transparent"
            >
              Created At
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => {
        return (
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="p-0 hover:bg-transparent"
            >
              Updated At
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: () => {
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetchGet("books");
        const dataJson = await res.json();
        const parsed = BooksSchema.safeParse(dataJson.data);
        if (parsed.success) {
          setBooks(parsed.data);
        } else {
          console.log(parsed);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-5 md:gap-6 md:py-6">
            <DataTableWrapper columns={columns} data={books} />
          </div>
        </div>
      </div>
    </>
  );
}
