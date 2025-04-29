"use client";

import { LoginForm } from "@/components/login-form"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Verifica si el usuario ya ha iniciado sesión
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      // Si ya está autenticado, redirige al dashboard
      router.push("/Usuario/Administradores");
    }
  }, [router]);
  return (
    
    <div>
      {
        <div 
          className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
          style={{
            backgroundImage: "url('/inicio_sesion.png')", // Reemplaza con tu ruta
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            }}
        >
          <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 bg-transparent">
            <div className="w-full max-w-sm md:max-w-3xl">
              <LoginForm />
            </div>
          </div>
        </div>
      }
    </div>

    
  )
}