import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      
      expect(
        cn(
          'base-class',
          isActive && 'active-class',
          isDisabled && 'disabled-class'
        )
      ).toBe('base-class active-class');
    });

    it('should merge tailwind classes properly', () => {
      // テストでは、tailwind-mergeの振る舞いもテストする
      expect(cn('px-2 py-1', 'py-2')).toBe('px-2 py-2');
      expect(cn('text-sm text-gray-500', 'text-blue-500')).toBe('text-sm text-blue-500');
      expect(cn('w-full', 'w-auto')).toBe('w-auto');
    });

    it('should handle undefined and false values', () => {
      expect(cn('text-base', undefined, false, 'text-center')).toBe('text-base text-center');
    });

    it('should handle array inputs', () => {
      expect(cn(['text-red-500', 'bg-blue-500'])).toBe('text-red-500 bg-blue-500');
    });

    it('should handle object inputs', () => {
      expect(cn({ 'text-red-500': true, 'bg-blue-500': false, 'p-4': true })).toBe('text-red-500 p-4');
    });

    it('should handle complex combinations', () => {
      const isError = true;
      const isActive = false;
      const additionalClasses = ['text-sm', 'rounded'];
      
      expect(
        cn(
          'base-class',
          additionalClasses,
          isError && 'text-red-500',
          isActive && 'bg-blue-500',
          { 'border': true, 'p-4': isError }
        )
      ).toBe('base-class text-sm rounded text-red-500 border p-4');
    });
  });
});