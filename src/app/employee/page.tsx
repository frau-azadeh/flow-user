"use client"

import { getEmployees } from "@/lib/api/employee";
import { useQuery } from "@tanstack/react-query";

export default function EmployeesPage(){
    const{data, error, isLoading} = useQuery({queryKey:["employee"], queryFn: getEmployees});

    if(isLoading) return <p className="text-center text-blue-500">در حال بارگذاری ... </p>
    if(error) return <p className="text-center text-red-500">خطایی ره داده است.</p>
    
    return(
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">لیست کارکنان</h1>
            <ul className="bg-white shadow-cyan-800 rounded-xl p-4">
                {data.map((employee: {id: string; name:string; email:string; position:string}) =>(
                    <li key={employee.id} className="border-b p-4 flex flex-col">
                        <strong className="text-lg">{employee.name}</strong>
                        <span className="text-gray-700">{employee.position}</span>
                        <span className="text-gray-700">{employee.email}</span>
                    </li>
                ))}
            </ul>
        </div>
    )

}