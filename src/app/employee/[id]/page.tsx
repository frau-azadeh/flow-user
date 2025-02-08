"use client";

import { getUsers } from "@/lib/api/employee";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function EmployeesPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["employees"], // تغییر نام کش برای هماهنگی بهتر
    queryFn: getUsers,
  });

  if (isLoading)
    return <p className="text-center text-blue-500">در حال بارگذاری ...</p>;

  if (error)
    return (
      <p className="text-center text-red-500">
        خطایی رخ داده است: {error.message}
      </p>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">لیست کارکنان</h1>
      <ul className="bg-white shadow-md rounded-xl p-4">
        {data.map((employee: { id: string; name: string; email: string; position: string }) => (
          <li key={employee.id} className="border-b p-4 flex flex-col space-y-1 last:border-none">
            <strong className="text-lg text-gray-900">{employee.name}</strong>
            <span className="text-gray-600">{employee.position}</span>
            <span className="text-gray-600">{employee.email}</span>
            <Link
              href={`/employee/${employee.id}/edit`}
              className="text-blue-500 hover:text-blue-700 transition-all"
            >
              ویرایش
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
