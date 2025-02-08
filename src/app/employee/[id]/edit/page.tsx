"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUser } from "@/lib/api/employee";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

type EmployeeForm = {
  name: string;
  email: string;
  position: string;
};

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<EmployeeForm>();

  console.log("params.id:", params.id); // مقدار id را در کنسول بررسی کن

  if (!params.id) {
    return <p className="text-center text-red-500">⚠️ خطا: شناسه نامعتبر است!</p>;
  }

  // دریافت اطلاعات کارمند
  const { data: employees, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: getUsers,
  });

  const employee = employees?.find((emp: { id: string }) => emp.id === params.id);

  useEffect(() => {
    if (employee) {
      setValue("name", employee.name);
      setValue("email", employee.email);
      setValue("position", employee.position);
    }
  }, [employee, setValue]);

  const mutation = useMutation({
    mutationFn: (data: EmployeeForm) => updateUser(params.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      router.push("/employee"); // هدایت بعد از ویرایش
    },
    onError: (error) => {
      console.error("خطا در ویرایش کارمند:", error);
    },
  });

  const onSubmit = (data: EmployeeForm) => {
    mutation.mutate(data);
  };

  if (isLoading) return <p className="text-center text-blue-500">در حال بارگذاری...</p>;
  if (error) return <p className="text-center text-red-500">خطا در دریافت اطلاعات: {error.message}</p>;

  if (!employee) {
    return <p className="text-center text-red-500">❌ کارمندی با این شناسه یافت نشد.</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">ویرایش اطلاعات کارمند</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <label className="font-medium">نام <span className="text-red-500">*</span></label>
        <input {...register("name", { required: true })} type="text" className="border p-2 rounded" />

        <label className="font-medium">ایمیل <span className="text-red-500">*</span></label>
        <input {...register("email", { required: true })} type="email" className="border p-2 rounded" />

        <label className="font-medium">عنوان شغلی <span className="text-red-500">*</span></label>
        <input {...register("position", { required: true })} type="text" className="border p-2 rounded" />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={mutation.isPending}>
          {mutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}
