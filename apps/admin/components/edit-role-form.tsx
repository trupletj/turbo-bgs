"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  profile_role,
  permission,
} from "@repo/database/generated/prisma/client";
import {
  createProfileRole,
  updateProfileRole,
} from "@/action/ProfileRoleService";
import { getPermissions } from "@/action/PermissionService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const formSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(2, { message: "Нэр хамгийн багадаа 2 тэмдэгттэй байна" })
    .max(100, { message: "Нэр 100 тэмдэгтээс хэтрэхгүй байна" }),
  permissions: z.array(z.string().uuid()).min(1, {
    message: "Ядаж нэг зөвшөөрөл сонгоно уу",
  }),
});

type FormValues = {
  id?: string;
  name: string;
  permissions: string[];
};

const EditRoleForm = ({
  profile_role,
}: {
  profile_role: (profile_role & { permissions: permission[] }) | null;
}) => {
  const router = useRouter();
  const [allPermissions, setAllPermissions] = useState<permission[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissions = await getPermissions({});
        setAllPermissions(permissions);
      } catch (error) {
        toast.error("Зөвшөөрлүүдийг ачаалахад алдаа гарлаа!");
        console.error(error);
      }
    };
    fetchPermissions();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: profile_role?.id,
      name: profile_role?.name ?? "",
      permissions: profile_role?.permissions?.map((perm) => perm.id) ?? [],
    },
  });

  async function onSubmit(values: FormValues) {
    const toastId = toast.loading("Хадгалж байна...");
    try {
      if (values.id) {
        await updateProfileRole(values.id, {
          name: values.name,
          permissions: {
            set: values.permissions.map((id) => ({ id })),
          },
        });
        toast.update(toastId, {
          render: "Хэрэглэгчийг амжилттай засварлалаа",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
      } else {
        await createProfileRole({
          name: values.name,
          permissions: {
            connect: values.permissions.map((id) => ({ id })),
          },
        });
        toast.update(toastId, {
          render: "Хэрэглэгчийг амжилттай бүртгэлээ",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
      }
      router.push("/dashboard/admin/roles");
    } catch (error) {
      toast.update(toastId, {
        render: `Алдаа: ${(error as Error).message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ролын нэр</FormLabel>
              <FormControl>
                <Input placeholder="Шинэ эрхийн нэрийг оруулна уу" {...field} />
              </FormControl>
              <FormDescription>Ролын харагдах нэр.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Permissions Field */}
        <FormField
          control={form.control}
          name="permissions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Зөвшөөрлүүд</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {allPermissions.map((perm) => (
                    <div key={perm.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={perm.id}
                        checked={field.value.includes(perm.id)}
                        onCheckedChange={(checked) => {
                          const newPermissions = checked
                            ? [...field.value, perm.id]
                            : field.value.filter((id) => id !== perm.id);
                          field.onChange(newPermissions);
                        }}
                      />
                      <label
                        htmlFor={perm.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {perm.name || perm.id}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                Permission-г сонгоно уу. Ядаж нэг permission сонгох ёстой.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Хадгалах
        </Button>
      </form>
    </Form>
  );
};

export default EditRoleForm;
