import { notFound } from "next/navigation";
import ConfirmRegistrationClient from "@/components/ConfirmRegistrationClient";

interface PageProps {
    searchParams: { token?: string };
}

const ConfirmRegistrationPage = ({ searchParams }: PageProps) => {
    if (!searchParams.token) return notFound();

    return <ConfirmRegistrationClient token={searchParams.token} />;
};

export default ConfirmRegistrationPage;