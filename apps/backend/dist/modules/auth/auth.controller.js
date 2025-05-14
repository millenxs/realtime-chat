"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const service = new auth_service_1.AuthService();
const register = async (req, res) => {
    try {
        const user = await service.register(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const result = await service.login(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};
exports.login = login;
