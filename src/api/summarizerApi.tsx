// src/api/summarizerApi.ts

const BASE_URL = "http://localhost:8080/api/v1/text";

export interface SummaryResponse {
    summary: string;
    sentenceCount: number;
    wordCount: number;
}

// Utility: Get token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
    }
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
};

// --- 1. Summarize Text API (POST /summarize) ---
export const summarizeTextAPI = async (
    text: string,
    mode: "paragraph" | "bullet",
    length: "short" | "medium" | "long"
): Promise<SummaryResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/summarize`, {
            method: "POST",
            headers: getAuthHeaders(), // ✅ JWT header added
            body: JSON.stringify({
                text,
                mode: mode.toUpperCase() === "BULLET" ? "BULLET_POINT" : "PARAGRAPH",
                summaryLength: length.toUpperCase(),
            }),
        });

        if (response.status === 401 || response.status === 403) {
            throw new Error("Authentication required. Please log in again.");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                message: `Server error: ${response.status}`,
            }));
            throw new Error(errorData.message || "Summarization failed.");
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};

// --- 2. Summarize File API (POST /summarize/file) ---
export const summarizeFileAPI = async (
    file: File,
    mode: "paragraph" | "bullet",
    length: "short" | "medium" | "long"
): Promise<SummaryResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("summaryLength", length.toUpperCase());
    formData.append("mode", mode.toUpperCase() === "BULLET" ? "BULLET_POINT" : "PARAGRAPH");

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Authentication token not found. Please log in again.");
        }

        const response = await fetch(`${BASE_URL}/summarize/file`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, 
            },
            body: formData,
        });

        if (response.status === 401 || response.status === 403) {
            throw new Error("Authentication required. Please log in again.");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                message: `Server error: ${response.status}`,
            }));
            throw new Error(errorData.message || "File summarization failed.");
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};
