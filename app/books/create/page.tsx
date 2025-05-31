"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { fetchPost } from "@/lib/client";
import { useState } from "react";

type Inputs = {
  title: string;
  author: string;
};

export default function CreateBookForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsSubmitting(true);
      const res = await fetchPost(`books`, data);
      if (res.ok) {
        router.push("/books/list");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-5 md:gap-6 md:py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {errors && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Book Title
                  </label>
                  <Input
                    id="title"
                    type="text"
                    className="w-full"
                    placeholder="Enter book title"
                    required
                    {...register("title")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Author
                  </label>
                  <Input
                    id="author"
                    type="text"
                    className="w-full"
                    placeholder="Enter author name"
                    required
                    {...register("author")}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Creating..." : "Create Book"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
