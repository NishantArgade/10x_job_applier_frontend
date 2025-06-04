import ComingSoon from "@/components/ui/coming-soon";

export default async function Profile() {
  return (
    <div className="container mx-auto py-6">
      <ComingSoon
        title="Profile Dashboard"
        description="We're building an amazing profile management experience where you can customize your settings, manage your account, and track your application progress."
        feature="Profile management"
        timeline="in the next update"
        variant="detailed"
      />
    </div>
  );
}
