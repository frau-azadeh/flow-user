"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "@/lib/api/employee";
import { useForm } from "react-hook-form";

type EmployeeForm = {
  name: string;
  email: string;
  position: string;
};

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  // دریافت اطلاعات کارمند از API
  const { data: employee, isLoading, error } = useQuery({
    queryKey: ["employee", params.id],
    queryFn: () => getUserById(params.id),
  });

  // مقداردهی اولیه فرم با داده‌های دریافتی (بدون useEffect)
  const { register, handleSubmit, reset } = useForm<EmployeeForm>({
    defaultValues: async () => {
      if (params.id) {
        const employeeData = await getUserById(params.id);
        return employeeData || { name: "", email: "", position: "" };
      }
      return { name: "", email: "", position: "" };
    },
  });

  // تابع آپدیت کاربر
  const mutation = useMutation({
    mutationFn: (data: EmployeeForm) => updateUser(params.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      router.push("/employee");
    },
    onError: (error) => {
      console.error("❌ خطا در ویرایش کارمند:", error);
    },
  });

  const onSubmit = (data: EmployeeForm) => {
    mutation.mutate(data);
  };

  if (isLoading) return <p className="text-center text-blue-500">⏳ در حال بارگذاری...</p>;
  if (error) return <p className="text-center text-red-500">❌ خطا در دریافت اطلاعات: {error.message}</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">✏️ ویرایش اطلاعات کارمند</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <label>نام:</label>
        <input {...register("name")} type="text" className="border p-2 rounded" />

        <label>ایمیل:</label>
        <input {...register("email")} type="email" className="border p-2 rounded" />

        <label>عنوان شغلی:</label>
        <input {...register("position")} type="text" className="border p-2 rounded" />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          ✔️ ذخیره تغییرات
        </button>
      </form>
    </div>
  );
}
