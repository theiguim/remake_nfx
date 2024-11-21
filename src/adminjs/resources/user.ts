import { ResourceOptions } from 'adminjs';
import bcrypt from 'bcrypt';

const userResourceOptions: ResourceOptions = {
  navigation: 'Administração',
  properties: {
    birth: {
      type: 'date',
    },
    password: {
      type: 'password',
    },
    role: {
      availableValues: [
        { value: 'admin', label: 'Administrador' },
        { value: 'user', label: 'Usuário Padrão' },
      ],
    },
  },
  editProperties: [
    'firstName',
    'lastName',
    'phone',
    'birth',
    'email',
    'password',
    'role',
  ],
  filterProperties: [
    'firstName',
    'lastName',
    'phone',
    'birth',
    'email',
    'role',
    'createdAt',
    'updatedAt',
  ],
  listProperties: ['id', 'firstName', 'email', 'role'],
  showProperties: [
    'id',
    'firstName',
    'lastName',
    'phone',
    'birth',
    'email',
    'role',
    'createdAt',
    'updatedAt',
  ],
  actions: {
    new: {
      before: async (request) => {
        if (request.payload && request.payload.password) {
          // Criptografar a senha antes de salvar
          request.payload.password = await bcrypt.hash(request.payload.password, 10);
        }
        return request;
      },
    },
    edit: {
      before: async (request) => {
        if (request.payload && request.payload.password) {
          // Criptografar a senha antes de atualizar
          request.payload.password = await bcrypt.hash(request.payload.password, 10);
        }
        return request;
      },
    },
  },
};

export { userResourceOptions };