"use client";

import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { permission as Permission } from "@repo/database/generated/prisma/client/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPermission, updatePermission } from "@/action/PermissionService";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

interface PermissionFormData {
  id?: string;
  name: string;
  action: "CREATE" | "READ" | "UPDATE" | "DELETE";
  resource: string;
  path: string[]; // Array of strings for paths
}

const actionEnum = z.enum(["CREATE", "READ", "UPDATE", "DELETE"]);

const EditPermissionForm = ({
  permission,
}: {
  permission: Permission | null;
}) => {
  const form = useForm<PermissionFormData>({
    defaultValues: {
      id: permission?.id,
      name: permission?.name ?? "",
      action: permission?.action ?? "READ",
      resource: permission?.resource ?? "",
      path: permission?.path ?? [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "path" as never,
  });

  const onSubmit: SubmitHandler<PermissionFormData> = async (values) => {
    try {
      const filteredPaths = values.path.filter((p) => p.trim() !== "");

      if (values.id) {
        await updatePermission({
          where: { id: values.id },
          data: {
            ...values,
            path: filteredPaths,
          },
        });
        toast.success("Амжилттай засварлалаа", {
          autoClose: 1000,
        });
        setTimeout(() => redirect("/dashboard/admin/permissions"), 1000);
      } else {
        await createPermission({
          ...values,
          path: filteredPaths,
        });
        toast.success("Амжилттай үүсгэлээ", {
          autoClose: 1000,
        });
        setTimeout(() => redirect("/dashboard/admin/permissions"), 1000);
      }
    } catch (error) {
      console.error("Error saving permission:", error);
      toast.error("Алдаа гарлаа: " + (error as Error).message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permission Name</FormLabel>
              <FormControl>
                <Input placeholder="user.manage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action type" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionEnum.options.map((actionValue) => (
                      <SelectItem key={actionValue} value={actionValue}>
                        {actionValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource</FormLabel>
              <FormControl>
                <Input placeholder="users" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Paths */}
        <div className="space-y-4">
          <FormLabel>Paths</FormLabel>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`path.${index}` as const}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="/api/users" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => append("")}
          >
            <Plus className="h-4 w-4" />
            Add Path
          </Button>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            {permission ? "Update Permission" : "Create Permission"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPermissionForm;
