import LoginForm from "@/components/LoginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="w-full max-w-md space-y-8">
      <header>
        <div className="text-center">
          <i className="fas fa-qrcode text-6xl text-indigo-400 mb-6 animate-float" />
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to your QuantumQR account</p>
        </div>
      </header>

      <main>
        <LoginForm />
      </main>

      <footer className="backdrop-blur-sm">
        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Register here
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;