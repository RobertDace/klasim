// src/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  getCurrentUser,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  error?: string;
}

export async function registerAction(formData: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    // 0. Rate Limiting: Maksimal 3 pendaftaran per 5 menit per IP
    const rateLimit = await checkRateLimit('register', 3, 5 * 60 * 1000);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: 'Terlalu banyak permintaan pendaftaran. Silakan coba lagi dalam beberapa menit.',
      };
    }

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      return { success: false, error: 'Semua kolom wajib diisi.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password minimal 6 karakter.' };
    }

    const cleanEmail = email.toLowerCase().trim();

    // Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return { success: false, error: 'Email sudah terdaftar. Silakan masuk.' };
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });

    // Buat session token
    const token = await createSessionToken(user.id, user.email);

    // Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 hari
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('Error during registration:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan server saat mendaftar.',
    };
  }
}

export async function loginAction(formData: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    // 0. Rate Limiting: Maksimal 5 percobaan login per menit per IP
    const rateLimit = await checkRateLimit('login', 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: 'Terlalu banyak percobaan masuk. Tunggu 1 menit sebelum mencoba lagi.',
      };
    }

    const { email, password } = formData;

    if (!email || !password) {
      return { success: false, error: 'Email dan password wajib diisi.' };
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return { success: false, error: 'Email atau password salah.' };
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return { success: false, error: 'Email atau password salah.' };
    }

    // Buat session token
    const token = await createSessionToken(user.id, user.email);

    // Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 hari
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  } catch (error) {
    console.error('Error during login:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan server saat masuk.',
    };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error('Error during logout:', error);
    return { success: false };
  }
}

export async function getCurrentUserAction() {
  return getCurrentUser();
}
