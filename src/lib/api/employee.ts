import { api } from "../api";

const axiosConfig = {
    headers: {
        "Content-Type": "application/json",
    },
};

// ✅ دریافت لیست کاربران
export const getUsers = async () => {
    try {
        const response = await api.get("/", axiosConfig);
        return response.data;
    } catch (error) {
        throw new Error("❌ دریافت کاربران ناموفق بود!");
    }
};

// ✅ دریافت اطلاعات یک کاربر خاص
export const getUserById = async (id: number | string) => {
    if (!id) throw new Error("❌ ID مورد نیاز است!");

    try {
        const response = await api.get(`/${id}`, axiosConfig);
        return response.data;
    } catch (error) {
        throw new Error("❌ دریافت اطلاعات کاربر ناموفق بود!");
    }
};

// ✅ ایجاد کاربر جدید
export const createUser = async (data: { name: string; email: string; position: string }) => {
    try {
        const response = await api.post("/", data, axiosConfig);
        return response.data;
    } catch (error) {
        throw new Error("❌ ایجاد کاربر ناموفق بود!");
    }
};

// ✅ بروزرسانی اطلاعات کاربر
export const updateUser = async (id: number | string, data: any) => {
    if (!id) throw new Error("❌ ID برای ویرایش ضروری است!");

    try {
        const response = await api.put(`/${id}`, data, axiosConfig);
        return response.data;
    } catch (error) {
        throw new Error("❌ بروزرسانی کاربر ناموفق بود!");
    }
};

// ✅ حذف کاربر
export const deleteUser = async (id: number | string) => {
    if (!id) throw new Error("❌ ID برای حذف ضروری است!");

    try {
        const response = await api.delete(`/${id}`, axiosConfig);
        return response.data;
    } catch (error) {
        throw new Error("❌ حذف کاربر ناموفق بود!");
    }
};
