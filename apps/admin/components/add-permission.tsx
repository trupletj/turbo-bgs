"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { permission as Permission } from "@repo/database/generated/prisma/client/client"; // Prisma permission type
import { createPermission } from "@/action/PermissionService";
import { Button } from "./ui/button";

const AddPermission = () => {
  // `permission`-ийг эхлээд бүрэн тохируулсан объектоор үүсгэж байна.
  const [permission, setPermission] = useState<Permission>({
    id: "",
    name: "",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
    resource: "",
    path: [],
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Заавал бүх шаардлагатай талбаруудыг бөглөсөн байх ёстой.
    if (!permission.name || !permission.resource || !permission.path.length) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setLoading(true);

    try {
      // Permission үүсгэх сервисийг дуудах
      const newPermission = await createPermission(permission);
      toast.success(`Permission "${newPermission.name}" successfully created!`);

      // Form-ийг цэвэрлэх
      setPermission({
        id: "",
        name: "",
        can_create: false,
        can_read: false,
        can_update: false,
        can_delete: false,
        resource: "",
        path: [],
      });
    } catch (error) {
      toast.error("Error creating permission!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // handleChange функц: permission объектыг шинэчлэх
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;

    // If type is checkbox, update boolean value
    if (type === "checkbox") {
      setPermission((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      // Update text and other field types
      setPermission((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-6">Add New Permission</h2>

      <form onSubmit={handleSubmit}>
        {/* Permission Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Permission Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={permission.name || undefined}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter permission name"
            required
          />
        </div>

        {/* Resource */}
        <div className="mb-4">
          <label
            htmlFor="resource"
            className="block text-sm font-medium text-gray-700"
          >
            Resource
          </label>
          <input
            type="text"
            id="resource"
            name="resource"
            value={permission.resource || undefined}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter resource"
            required
          />
        </div>

        {/* Path */}
        <div className="mb-4">
          <label
            htmlFor="path"
            className="block text-sm font-medium text-gray-700"
          >
            Path
          </label>
          <input
            type="text"
            id="path"
            name="path"
            value={permission.path.join(", ")}
            onChange={(e) => {
              const paths = e.target.value
                .split(",")
                .map((item) => item.trim());
              setPermission((prev) => ({ ...prev, path: paths }));
            }}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter paths (comma separated)"
            required
          />
        </div>

        {/* Permission Actions */}
        <div className="mb-4 space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="can_create"
              name="can_create"
              checked={permission.can_create}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="can_create" className="ml-2 text-sm text-gray-700">
              Can Create
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="can_read"
              name="can_read"
              checked={permission.can_read}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="can_read" className="ml-2 text-sm text-gray-700">
              Can Read
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="can_update"
              name="can_update"
              checked={permission.can_update}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="can_update" className="ml-2 text-sm text-gray-700">
              Can Update
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="can_delete"
              name="can_delete"
              checked={permission.can_delete}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="can_delete" className="ml-2 text-sm text-gray-700">
              Can Delete
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded-md hover:bg-gray-500"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Permission"}
        </Button>
      </form>
    </div>
  );
};

export default AddPermission;
