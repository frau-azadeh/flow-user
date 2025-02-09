
import { api } from "../api";
// ✅ دریافت لیست کاربران
export const getUsers = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        console.error("❌ خطا در دریافت کاربران:", error);
        throw error;
    }
};

// ✅ دریافت یک کاربر خاص بر اساس `id`
export const getUserById = async (id: number | string) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ خطا در دریافت اطلاعات کاربر با ID: ${id}`, error);
        throw error;
    }
};

// ✅ ایجاد کاربر جدید
export const createUser = async (data: { name: string; email: string; position: string }) => {
    try {
        console.log("📤 ارسال اطلاعات برای ایجاد کاربر جدید:", JSON.stringify(data, null, 2));

        const response = await api.post("/", data);
        return response.data;
    } catch (error) {
        console.error("❌ خطا در ایجاد کاربر:", error);
        throw error;
    }
};

// ✅ بروزرسانی اطلاعات کاربر
export const updateUser = async (id: number | string, data: any) => {
    try {
        console.log("📤 ارسال اطلاعات برای ویرایش:", JSON.stringify(data, null, 2));

        const response = await api.put(`/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("❌ خطا در بروزرسانی کارمند:", error);
        throw error;
    }
};

// ✅ حذف کاربر
export const deleteUser = async (id: number | string) => {
    try {
        console.log(`🗑 حذف کاربر با ID: ${id}`);

        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ خطا در حذف کاربر با ID: ${id}`, error);
        throw error;
    }
};
