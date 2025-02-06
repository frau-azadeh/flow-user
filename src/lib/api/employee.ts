import { api } from "../api";

export const createUser = async (employee:{name: string; email:string; position:string})=>{
    const {data} = await api.post("/", employee);
    return data;
}

export const getUsers = async () => {
    const { data } = await api.get("/");
    return data;
  };

  export const updateUser = async (id: string, user: { name: string; email: string }) => {
    const { data } = await api.put(`/users/${id}`, user); 
    return data;
  };
  
  export const deleteUser = async (id: string) => {
    await api.delete(`/users/${id}`); 
  };
  