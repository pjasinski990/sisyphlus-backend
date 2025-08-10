import { User } from '@/feature/auth/entity/user';

export interface UserRepo {
    upsert(user: User): Promise<User>;
    getById(id: string): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
}
