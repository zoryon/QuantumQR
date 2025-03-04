import Link from "next/link";
import { Button } from "./ui/button";

const LoginBtn = () => {
    return (
        <Link href="/login">
            <Button className="rounded-full bg-white text-black hover:bg-gray-100 gap-3 px-6">
                <i className="fa-solid fa-user"></i> Login
            </Button>
        </Link>
    );
}

export default LoginBtn;