"use client";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from '@/components/layout/Loader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();  
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      if(session.user.role === "ADMIN") {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "authenticated") {
    return null; 
  }

  return children;
}