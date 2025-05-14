"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../../config/database");
const auth_utils_1 = require("./auth.utils");
class AuthService {
    async register(data) {
        const userExists = await database_1.prisma.user.findUnique({ where: { email: data.email } });
        if (userExists)
            throw new Error('Email já cadastrado');
        const hashed = await (0, auth_utils_1.hashPassword)(data.password);
        const user = await database_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashed
            }
        });
        return { id: user.id, name: user.name, email: user.email };
    }
    async login(data) {
        const user = await database_1.prisma.user.findUnique({ where: { email: data.email } });
        if (!user)
            throw new Error('Usuário não encontrado');
        const valid = await (0, auth_utils_1.comparePassword)(data.password, user.password);
        if (!valid)
            throw new Error('Senha incorreta');
        const token = (0, auth_utils_1.generateToken)(user.id);
        return { token };
    }
}
exports.AuthService = AuthService;
