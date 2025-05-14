import { prisma } from '../../config/database';
import { RegisterDTO, LoginDTO } from './auth.dto';
import { hashPassword, comparePassword, generateToken } from './auth.utils';

export class AuthService {
  async register(data: RegisterDTO) {
    const userExists = await prisma.user.findUnique({ where: { email: data.email } });
    if (userExists) throw new Error('Email já cadastrado');

    const hashed = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed
      }
    });

    return { id: user.id, name: user.name, email: user.email };
  }

  async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Usuário não encontrado');

    const valid = await comparePassword(data.password, user.password);
    if (!valid) throw new Error('Senha incorreta');

    const token = generateToken(user.id);
    return { 
        token, 
        user: { 
            id: user.id, 
            name: user.name, 
            email: user.email } };
  }
}
