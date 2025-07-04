"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { getPermissions } from "@/action/PermissionService";
import { createProfileRole } from "@/action/ProfileRoleService";

const AddRoleForm = ({ isDialogOpen, setIsDialogOpen }: any) => {
  const [name, setName] = useState(""); // Үүргийн нэр
  const [permissions, setPermissions] = useState<any[]>([]); // Permissions-ууд
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]); // Сонгосон permissions

  useEffect(() => {
    const fetchPermissions = async () => {
      const perms = await getPermissions({}); // Permissions авах
      setPermissions(perms);
    };

    fetchPermissions();
  }, []);

  // Permissions сонгох
  const handlePermissionChange = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id)
        ? prev.filter((permissionId) => permissionId !== id)
        : [...prev, id]
    );
  };

  const onSubmit = async () => {
    try {
      //   await createProfileRole(

      //         name: name,
      //         permissions: {
      //           connect: selectedPermissions.map((permissionId) => ({
      //             id: permissionId, // Сонгосон permissions
      //           })),
      //         },
      //       );
      //     }
      toast.success("Шинэ үүрэг амжилттай үүслээ!");
      setIsDialogOpen(false); // Dialog хаах
    } catch (error) {
      toast.error("Үүрэг үүсгэхэд алдаа гарлаа.");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Шинэ үүрэг үүсгэх</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Үүргийн нэр */}
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="Үүргийн нэр"
          />
          <div>
            <label>Permissions:</label>
            <div className="flex gap-2">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => handlePermissionChange(permission.id)}
                  />
                  <label>{permission.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Цуцлах
            </Button>
            <Button onClick={onSubmit}>Үүсгэх</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleForm;
