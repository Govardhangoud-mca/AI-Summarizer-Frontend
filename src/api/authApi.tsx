
import Swal from 'sweetalert2';

const BASE_URL = "http://localhost:8080/api/v1/auth";
const REGISTER_URL = `${BASE_URL}/register`;
const LOGIN_URL = `${BASE_URL}/login`;


export const registerAPI = async (username: string, password: string, role: string = "USER"): Promise<boolean> => {
    try {
        const res = await fetch(REGISTER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role }),
            credentials: "include", 
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
            Swal.fire("Registration Failed", errorData.message || "Error during registration.", "error");
            return false;
        }

        Swal.fire("Success", "Registration successful! You can now log in.", "success");
        return true;
    } catch (error) {
        Swal.fire("Error", "Network error during registration.", "error");
        return false;
    }
};

export const loginAPI = async (username: string, password: string): Promise<{ success: boolean; token?: string }> => {
    try {
        const res = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include", 
        });

        if (res.ok) {
            const data = await res.json();
            return { success: true, token: data.token };
        } else {
            const errorData = await res.json().catch(() => ({ message: "Invalid credentials" }));
            Swal.fire("Login Failed", errorData.message || "Invalid username or password", "error");
            return { success: false };
        }
    } catch (error) {
        Swal.fire("Error", "Network error during login.", "error");
        return { success: false };
    }
};
