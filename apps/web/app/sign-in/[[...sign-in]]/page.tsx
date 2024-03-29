import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex justify-center items-center min-h-[100dvh]">
      <SignIn />
    </section>
  );
}
