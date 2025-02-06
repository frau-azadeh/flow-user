import { api } from "../api";

export const createEmployee = async (employee:{name: string; email:string; position:string})=>{
    const {data} = await api.post("/", employee);
    return data;
}

export const getEmployees = async () => {
    const { data } = await api.get("/");
    return data;
  };