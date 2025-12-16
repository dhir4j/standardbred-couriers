import AdminUserDetails from "@/components/admin/admin-user-details";

export default function UserDetailsPage({ params }: { params: { userId: string }}) {
    return <AdminUserDetails userId={params.userId} />;
}
