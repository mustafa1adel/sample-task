import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  password: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @Column()
  @ApiProperty()
  middleName: string;

  @Column()
  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @Column()
  userName: string;

  @Column({ type: 'date' })
  @ApiProperty()
  dob: string;

  @ApiProperty()
  @Column()
  state: string;

  @ApiProperty()
  @Column()
  city: string;

  @Column()
  @ApiProperty()
  phone: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: ['male', 'female'], default: 'male' })
  gender: string;

  @Column()
  @ApiProperty()
  avatarUrl: string;
}
