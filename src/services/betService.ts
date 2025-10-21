import axios from "axios";
import { catchAxiosError } from "./authService";
import { BetPlace } from "../components/types";

export const getContextId = async () => {
    try {
        const res = await axios.get("/sportsbook/context-id");
        return res.data;
    } catch (error) {
        catchAxiosError(error)
    }
}

export const getLeagues = async () => {
    try {
        const res = await axios.get("/sportsbook/leagues");
        return res.data;
    } catch (error) {
        catchAxiosError(error)
    }
}

export const getOdds = async (leagueId: string) => {
    try {
        const res = await axios.get(`/sportsbook/odds?leagueId=${leagueId}`);
        return res.data;
    } catch (error) {
        catchAxiosError(error)
    }
}

export const betPlace = async (betSlip:BetPlace) => {
    try {
        const res = await axios.post("/sportsbook/betPlace", betSlip);
        return res.data;
    } catch (error) {
        catchAxiosError(error)
    }
}

export const getHistory = async (current: number, pageSize: number) => {
    try {
        const res = await axios.get(`/auth/betSlips`,{
            params:{
                skip:(current-1)*pageSize,
                limit:pageSize
            }
        });
        return res.data;
    } catch (error) {
        catchAxiosError(error)
    }
}