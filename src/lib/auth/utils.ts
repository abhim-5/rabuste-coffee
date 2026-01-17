// Authentication utility functions

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

export function validatePassword(password: string): { 
  isValid: boolean; 
  error?: string;
  strength?: 'weak' | 'medium' | 'strong';
} {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters', strength: 'weak' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

  if (strengthScore < 2) {
    return { 
      isValid: false, 
      error: 'Password must contain at least uppercase, lowercase, and numbers',
      strength: 'weak'
    };
  }

  if (strengthScore === 2) {
    return { isValid: true, strength: 'medium' };
  }

  return { isValid: true, strength: 'strong' };
}

export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: 'Name must be less than 100 characters' };
  }

  return { isValid: true };
}

export function validateAge(age: number | string): { isValid: boolean; error?: string } {
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;

  if (isNaN(ageNum)) {
    return { isValid: false, error: 'Age must be a number' };
  }

  if (ageNum < 13) {
    return { isValid: false, error: 'You must be at least 13 years old' };
  }

  if (ageNum > 120) {
    return { isValid: false, error: 'Please enter a valid age' };
  }

  return { isValid: true };
}

export function getPasswordStrengthColor(strength?: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}

export function getPasswordStrengthWidth(strength?: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'weak':
      return 'w-1/3';
    case 'medium':
      return 'w-2/3';
    case 'strong':
      return 'w-full';
    default:
      return 'w-0';
  }
}
