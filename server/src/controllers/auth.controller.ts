import {type Request, type Response} from "express";
import {authService} from "@services/auth.service.js";

export async function register(req: Request, res: Response) {
    const result = await authService.register(req.body);

    res.status(201).json(result);
}