import axios from "axios";

const API_BASE_URL = "https://679a1892747b09cdcccdac6b.mockapi.io/employee"; // مسیر اصلاح‌شده

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// دریافت همه کاربران
export const getUsers = async () => {
    try {
        const response = await api.get("/users"); // بررسی مسیر صحیح API
        return response.data;
    } catch (error) {
        console.error("❌ خطا در دریافت کاربران:", error);
        throw error;
    }
};

// دریافت کاربر خاص
export const getUserById = async (id: string) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ خطا در دریافت اطلاعات کاربر با ID: ${id}`, error);
        throw error;
    }
};

// بروزرسانی کاربر
export const updateUser = async (id: string, data: any) => {
    try {
        console.log("📤 ارسال اطلاعات برای ویرایش:", JSON.stringify(data, null, 2));

        const response = await api.put(`/users/${id}`, data); // مسیر اصلاح‌شده
        return response.data;
    } catch (error) {
        console.error("❌ خطا در بروزرسانی کارمند:", error);
        throw error;
    }
};
