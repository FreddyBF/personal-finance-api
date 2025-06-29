
import { CreateUserDTO } from './create-user.dto';
export type UserResponseDTO = Omit<CreateUserDTO, 'password'>;