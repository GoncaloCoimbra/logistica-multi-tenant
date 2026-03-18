import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser = {
    id: 'user-123',
    email: 'admin@logistica.com',
    companyId: 'company-1',
    isActive: true,
    role: 'ADMIN',
    name: 'Admin User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findByCompany', () => {
    it('should return all users for a company', async () => {
      const companyId = 'company-1';
      const users = [mockUser, { ...mockUser, id: 'user-456', email: 'operator@logistica.com' }];

      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findByCompany(companyId);

      expect(result).toEqual(users);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { companyId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
    });

    it('should return empty array if no users found', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findByCompany('nonexistent-company');

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('user-123');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findByEmail('admin@logistica.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'admin@logistica.com' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findSuperAdmins', () => {
    it('should return all super admin users', async () => {
      const superAdmins = [{ ...mockUser, role: 'SUPER_ADMIN' }];

      mockPrismaService.user.findMany.mockResolvedValue(superAdmins);

      const result = await service.findSuperAdmins();

      expect(result).toEqual(superAdmins);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { role: 'SUPER_ADMIN' },
      });
    });
  });


});
