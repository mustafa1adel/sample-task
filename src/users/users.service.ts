import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(attrs: Partial<User>) {
    const user = this.repo.create(attrs);

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      throw new BadRequestException('No user is login.');
    }
    return this.repo.findOneBy({ id: id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user NOT FOUND!');
    }
    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user NOT FOUND!');
    }
    return this.repo.remove(user);
  }
}
