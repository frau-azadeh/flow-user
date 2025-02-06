"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api/employee";
import { useState } from "react";

// تعریف نوع کاربر
type User = {
  id: string; // بررسی کنید که API `id` را به عنوان `string` نیاز دارد یا `number`
  name: string;
  email: string;
  position: string;
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState<Omit<User, "id">>({ name: "", email: "", position: "" });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // دریافت کاربران از API
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // ایجاد کاربر جدید
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.setQueryData<User[]>(["users"], (oldUsers) => [...(oldUsers || []), data]);
    },
  });

  // ویرایش کاربر
  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: string; user: Omit<User, "id"> }) => updateUser(id, user),
    onMutate: async ({ id, user }) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
        oldUsers ? oldUsers.map((u) => (u.id === id ? { ...u, ...user } : u)) : []
      );

      return { previousUsers };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // حذف کاربر
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
        oldUsers ? oldUsers.filter((user) => user.id !== id) : []
      );

      return { previousUsers };
    },
    onError: (_err, _id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) return <p className="text-center text-blue-500">در حال بارگذاری...</p>;
  if (error) return <p className="text-center text-red-500">خطا در دریافت اطلاعات!</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">مدیریت کاربران</h1>

      {/* فرم افزودن کاربر */}
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createUserMutation.mutate(newUser);
          setNewUser({ name: "", email: "", position: "" });
        }}
      >
        <input
          type="text"
          placeholder="نام"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border p-2 flex-1 rounded"
          required
        />
        <input
          type="email"
          placeholder="ایمیل"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 flex-1 rounded"
          required
        />
        <input
          type="text"
          placeholder="شغل"
          value={newUser.position}
          onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
          className="border p-2 flex-1 rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          افزودن
        </button>
      </form>

      {/* لیست کاربران */}
      <ul className="bg-white shadow-md rounded-lg p-4">
        {users?.map((user) => (
          <li key={user.id} className="border-b p-4 last:border-none flex justify-between">
            {editingUser?.id === user.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateUserMutation.mutate({ id: user.id, user: editingUser });
                  setEditingUser(null);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="border p-2 flex-1 rounded"
                />
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="border p-2 flex-1 rounded"
                />
                <input
                  type="text"
                  value={editingUser.position}
                  onChange={(e) => setEditingUser({ ...editingUser, position: e.target.value })}
                  className="border p-2 flex-1 rounded"
                />
                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                  ذخیره
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  لغو
                </button>
              </form>
            ) : (
              <div>
                <strong className="text-lg">{user.name}</strong>
                <span className="block text-gray-600">{user.email}</span>
                <span className="block text-gray-600">{user.position}</span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setEditingUser(user)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                ویرایش
              </button>
              <button
                onClick={() => deleteUserMutation.mutate(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
