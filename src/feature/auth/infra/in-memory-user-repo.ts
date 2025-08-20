import { UserRepo } from '@/feature/auth/application/port/out/user-repo';
import { User } from '@/feature/auth/entity/user';

export class InMemoryUserRepo implements UserRepo {
    users: User[] = [];

    async upsert(user: User): Promise<User> {
        if (this.users.find(s => s.id === user.id)) {
            this.users = this.users.map(s => s.id === user.id ? user : s);
        } else {
            this.users.push(user);
        }
        return user;
    }

    async getByEmail(email: string): Promise<User | null> {
        const user = this.users.find(s => s.email === email);
        return user ?? null;
    }

    async getById(id: string): Promise<User | null> {
        const user = this.users.find(s => s.id === id);
        return user ?? null;
    }
}
