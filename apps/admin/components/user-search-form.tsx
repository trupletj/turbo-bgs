"use client";
import { useState, useEffect, useTransition } from "react";
import { useDebounce } from "use-debounce";
import { getSearchUsers } from "@/action/UserService";
import { user as User } from "@repo/database/generated/prisma/client/client";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getJobPostionOne } from "@/action/JobPositionService";
import { Button } from "./ui/button";
import { profile_role as Role } from "@repo/database/generated/prisma/client/client";
import { getProfileRoles } from "@/action/ProfileRoleService";
import { createProfile, getProfile } from "@/action/ProfileService";
import { toast } from "react-toastify";

const UserSearchForm = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedJobPosition, setSelectedJobPosition] = useState<{
    name?: string | null;
    organization?: { name: string } | null;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    startTransition(() => {
      getSearchUsers(debouncedQuery).then(setResults);
    });
  }, [debouncedQuery]);

  const handleSelect = async (user: User) => {
    setSelectedUser(user);
    setResults([]);
    setQuery("");
    const profileRoles = await getProfileRoles({});
    setRoles(profileRoles);
    if (!user.job_position_id) return;
    const jobPosition = await getJobPostionOne({
      where: {
        bteg_id: user.job_position_id,
        is_active: false,
      },
      include: {
        organization: true,
      },
    });
    setSelectedJobPosition(jobPosition);
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRoles((prevSelected) => {
      const updated = new Set(prevSelected);
      if (updated.has(roleId)) {
        updated.delete(roleId);
      } else {
        updated.add(roleId);
      }
      return updated;
    });
  };

  const handleSaveProfile = async () => {
    if (!selectedUser) return;

    try {
      const is_registered = await getProfile({
        where: {
          user_id: selectedUser.id,
        },
      });

      if (is_registered) {
        toast.warning("Хэрэглэгч бүртгэлтэй байна", {
          autoClose: 1000,
        });
        return;
      }

      await createProfile({
        user_id: selectedUser.id,
        profile_roles: {
          connect: Array.from(selectedRoles).map((id) => ({ id })),
        },
      });
      toast.success("Хэрэглэгчийг амжилттай бүртгэлээ", {
        autoClose: 1500,
        onClose: () => {
          window.location.href = "/dashboard/admin/users";
        },
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Профайл хадгалахад алдаа гарлаа", {
        autoClose: 1500,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Command>
        <CommandInput
          value={query}
          placeholder="Search by name or registration number..."
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 0 ? (
            results.length > 0 ? (
              results.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.first_name} ${user.last_name} ${user.register_number}`}
                  onSelect={() => handleSelect(user)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.register_number} • {user.nice_name}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )
          ) : null}
        </CommandList>
      </Command>

      {selectedUser && (
        <div className="border p-4 rounded-md bg-gray-50">
          <h2 className="text-lg font-semibold">
            {selectedUser.first_name} {selectedUser.last_name}
          </h2>
          <p>РД: {selectedUser.register_number}</p>
          <p>Албан тушаал ID: {selectedUser.job_position_id}</p>
          <p>И-мэйл: {selectedUser.email}</p>
          <p>Гэрийн хаяг: {selectedUser.address}</p>

          {selectedJobPosition && (
            <>
              <p>
                Албан тушаал нэр: {selectedJobPosition.name ?? "Тодорхойгүй"}
              </p>
              <p>
                Байгууллага:{" "}
                {selectedJobPosition.organization?.name ?? "Тодорхойгүй"}
              </p>
            </>
          )}

          {/* Сонгосон эрхүүдийг чекбоксоор харуулах */}
          <div>
            <h3 className="font-medium">Сонгох эрхүүд:</h3>
            <div className="space-y-2">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    checked={selectedRoles.has(role.id)}
                    onChange={() => handleRoleChange(role.id)}
                  />
                  <label htmlFor={`role-${role.id}`} className="text-sm">
                    {role.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {isPending ? (
            <div className="text-center text-gray-500">
              Бүртгэл хийгдэж байна...
            </div>
          ) : (
            <Button onClick={handleSaveProfile}>Бүртгэх</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchForm;
