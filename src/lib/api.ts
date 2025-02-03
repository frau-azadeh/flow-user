import axios from "axios";

const API_BASE_URL = "https://679a1892747b09cdcccdac6b.mockapi.io/employee/managment";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers:{
        "Content-Type": "application/json",
    },
})