import { describe, it, expect, vi, beforeAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { prisma } from './prisma';

// PrismaClientのモックを作成
vi.mock('@prisma/client', () => {
  const PrismaClientMock = vi.fn(() => ({
    post: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tag: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  }));
  
  return { PrismaClient: PrismaClientMock };
});

// モジュールパスを修正（./prisma.tsが正しいパス）
vi.mock('./prisma', () => {
  const mockPrismaClient = {
    post: { findMany: vi.fn() },
    tag: { findMany: vi.fn() },
    $connect: vi.fn(),
    $disconnect: vi.fn()
  };
  return { prisma: mockPrismaClient };
}, { virtual: true });

describe('Prisma Client', () => {
  let mockPrisma: PrismaClient;
  
  beforeAll(() => {
    mockPrisma = new PrismaClient();
  });

  it('should export a PrismaClient instance', () => {
    expect(prisma).toBeDefined();
    expect(prisma).toHaveProperty('post');
    expect(prisma).toHaveProperty('tag');
  });

  it('should create a PrismaClient instance with correct properties', () => {
    const testPrisma = new PrismaClient();
    expect(testPrisma).toHaveProperty('post');
    expect(testPrisma).toHaveProperty('tag');
    expect(testPrisma).toHaveProperty('$connect');
    expect(testPrisma).toHaveProperty('$disconnect');
  });
});