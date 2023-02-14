import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  middleName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  dob: string;

  @Expose()
  state: string;

  @Expose()
  city: string;

  @Expose()
  phone: string;

  @Expose()
  gender: string;

  @Expose()
  avatarUrl: string;
}
