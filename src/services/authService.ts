import axios from "axios";

export interface RegisterData {
    email: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
}
export interface AuthResponse {
    token: string;
    user: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
        connected: boolean;
        balance: number;
        totalBets: number;
        totalProfit:number;
        totalStake:number;
        winRate:number;
        isAdmin:number;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export const catchAxiosError = (error: any) => {
    if (!error.request) throw "Error is ocoured!";
    else if (!error.response) throw "Network error!";
    else if (typeof error.response.data === "string" && error.response.data.length < 200) throw error.response.data;
    else throw "Error is ocoured!";
}

export const authService = {
    // Login user
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            const response = await axios.post('/auth/signin/local', credentials);
            return response.data;
        } catch (error) {
            throw catchAxiosError(error);
        }
    },

    // Register user
    register: async (userData: RegisterData): Promise<AuthResponse> => {
        try {
            const response = await axios.post('/auth/signup', userData);
            return response.data;
        } catch (error) {
            throw catchAxiosError(error);
        }
    },

    // Get current user profile
    getProfile: async () => {
        try {
            const response = await axios.post('/auth/signin/jwt');
            return response.data;
        } catch (error) {
            throw catchAxiosError(error);
        }
    },

    // Refresh token
    refreshToken: async (): Promise<AuthResponse> => {
        const response = await axios.post('/auth/refresh');
        return response.data;
    },
};