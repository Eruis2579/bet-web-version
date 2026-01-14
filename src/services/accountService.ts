import axios from 'axios';
import { catchAxiosError } from './authService';

export interface Account {
  id: string;
  service: string;
  username: string;
  password: string;
  user_max: number;
  balance: number;
  available: number;
  atrisk: number;
  sessionId?: string;
  proxy?: string;
}

export type AccountPayload = Omit<Account, 'id'>;

const normalizeAccount = (raw: any, fallbackSite?: string, index?: number): Account => {
  const service =
    (raw?.service ?? fallbackSite ?? '').toString().trim() || 'Unknown';
  const username = raw?.username?.toString?.().trim?.() ?? raw?.username ?? '';
  const password = raw?.password?.toString?.().trim?.() ?? raw?.password ?? '';
  const balance = Number(raw?.balance ?? 0);
  const available = Number(raw?.available ?? 0);
  const atrisk = Number(raw?.atrisk ?? 0);
  const user_max = Number(raw?.user_max ?? 0);
  const sessionId =
    raw?.sessionId ??
    raw?.sessionID ??
    raw?.session_id ??
    raw?.sessionid ??
    undefined;

  const id =
    raw?._id?.toString?.() ??
    raw?.id?.toString?.() ??
    `${service}-${(username || index) ? index : Date.now()}`;

  return {
    id,
    service,
    username,
    password,
    user_max,
    balance: Number.isFinite(balance) ? balance : 0,
    available: Number.isFinite(available) ? available : 0,
    atrisk: Number.isFinite(atrisk) ? atrisk : 0,
    sessionId: sessionId ? sessionId.toString() : undefined,
  };
};

const mapAccountsResponse = (data: unknown): Account[] => {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.map((item, index) => normalizeAccount(item, item?.service, index));
  }

  if (typeof data === 'object') {
    return Object.entries(data as Record<string, unknown>).flatMap(
      ([service, collection]) => {
        if (!Array.isArray(collection)) return [];
        return collection.map((item, index) =>
          normalizeAccount(item, service, index)
        );
      }
    );
  }

  return [];
};

export const accountService = {
  list: async (): Promise<Account[]> => {
    try {
      const response = await axios.get('/general/account');
      return mapAccountsResponse(response.data);
    } catch (error) {
      catchAxiosError(error);
      throw error;
    }
  },

  create: async (payload: Omit<AccountPayload, 'balance' | 'available' | 'atrisk'>): Promise<Account> => {
    try {
      const response = await axios.post('/general/account/create', payload);
      const { data } = response;

      if (Array.isArray(data) || typeof data === 'object') {
        const normalized = mapAccountsResponse(data);
        if (normalized.length === 1) {
          return normalized[0];
        }
      }

      return normalizeAccount(data, payload.service);
    } catch (error) {
      catchAxiosError(error);
      throw error;
    }
  },

  update: async (id: string, payload: Omit<AccountPayload, 'balance' | 'available' | 'atrisk'>): Promise<Account> => {
    try {
      const response = await axios.post(`/general/account/update`, payload);
      return normalizeAccount(response.data, payload.service);
    } catch (error) {
      catchAxiosError(error);
      throw error;
    }
  },

  remove: async (id: string, payload: Omit<AccountPayload, 'balance' | 'available' | 'atrisk'>): Promise<void> => {
    try {
      await axios.put(`/general/account/delete`, payload);
    } catch (error) {
      catchAxiosError(error);
      throw error;
    }
  },

  refresh: async (): Promise<Account[]> => {
    try {
      const response = await axios.post('/general/account/refresh');
      return mapAccountsResponse(response.data);
    } catch (error) {
      catchAxiosError(error);
      throw error;
    }
  },
};

