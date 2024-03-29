import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex justify-center items-center min-h-[100dvh]">
      <SignUp />
    </section>
  );
}
