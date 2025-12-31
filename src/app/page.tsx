import Chatbot from "@/components/chatbot/Chatbot";

export default function HomePage() {
  return (
    <section
      className="rounded-3xl border p-4 sm:p-6 shadow-sm"
      style={{ background: "var(--cefix-card)", borderColor: "var(--cefix-border)" }}
    >
      <Chatbot />
    </section>
  );
}
