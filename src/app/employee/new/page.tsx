"use client"

import { createUser } from "@/lib/api/employee";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

type EmployeeForm = {
    name: string;
    email: string;
    position: string;
}

export default function CreateEmployeePage(){
    const queryClient = useQueryClient();
    const {register, handleSubmit, reset} = useForm<EmployeeForm>();

const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () =>{
        queryClient.invalidateQueries({queryKey: ["employees"]});
        reset();
    },
});

const onSubmit = (data: EmployeeForm)=>{
    mutation.mutate(data);
};

return(
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">اضافه کردن کارمند جدید</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
            <label className="text-gray-800">نام<span className="text-red-500">*</span></label>
            <input
                {...register("name", {required:"لطفا نام را وارد کنید!"})}
                type="text"
                placeholder="نام"
                className="border p-2 rounded"
            />
            <label className="text-gray-800">ایمیل<span className="text-red-500">*</span></label>
            <input
                {...register("email", {required:"لطفا ایمیل خود را وارد کنید!"})}
                type="email"
                placeholder="ایمیل"
                className="border p-2 rounded"
            />
            <label className="text-gray-800">عنوان شغلی<span className="text-red-500">*</span></label>
            <input
                {...register("position", {required:"عنوان شغلی خود را وارد کنید!"})}
                type="text"
                placeholder="عنوان شغلی"
                className="border p-2 rounded"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
                disabled={mutation.isPending}
            >
                {mutation.isPending ? "در حال ارسال اطلاعات":"افزودن کارمند"}
            </button>
            {mutation.isError&&<p className="text-red-500">خطایی رخ داده !</p>}
        </form>
    </div>
)

}