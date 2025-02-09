"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "@/lib/api/employee";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type EmployeeForm = {
  name: string;
  email: string;
  position: string;
};

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  // دریافت اطلاعات کارمند
  const { data: employee, isLoading, error } = useQuery({
    queryKey: ["employee", params.id],
    queryFn: () => getUserById(params.id),
    enabled: !!params.id, // فقط اگر `id` مقدار داشته باشد اجرا شود
  });

  // مقداردهی اولیه فرم بدون `useEffect`
  const { register, handleSubmit } = useForm<EmployeeForm>({
    values: employee || { name: "", email: "", position: "" }, // مقداردهی اولیه فرم با داده API
  });

  // تابع ویرایش اطلاعات
  const mutation = useMutation({
    mutationFn: (data: EmployeeForm) => updateUser(params.id, data),
    onMutate: () => {
      toast.loading("⏳ در حال ذخیره تغییرات...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.dismiss();
      toast.success("✅ تغییرات با موفقیت ذخیره شد!");
      router.push("/employee/edit"); // بازگشت به لیست کارکنان
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("❌ خطا در ویرایش کارمند: " + error.message);
    },
  });

  const onSubmit = (data: EmployeeForm) => {
    mutation.mutate(data);
  };

  if (isLoading) return <p className="text-center text-blue-500">⏳ در حال بارگذاری...</p>;
  if (error) return <p className="text-center text-red-500">❌ خطا در دریافت اطلاعات: {error.message}</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">✏️ ویرایش اطلاعات کارمند</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <label className="font-medium">نام <span className="text-red-500">*</span></label>
        <input {...register("name", { required: true })} type="text" className="border p-2 rounded" />

        <label className="font-medium">ایمیل <span className="text-red-500">*</span></label>
        <input {...register("email", { required: true })} type="email" className="border p-2 rounded" />

        <label className="font-medium">عنوان شغلی <span className="text-red-500">*</span></label>
        <input {...register("position", { required: true })} type="text" className="border p-2 rounded" />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {mutation.isPending ? "⏳ در حال ذخیره..." : "✔️ ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}
