import GreetingSection from "./GreetingSection";
import CardSection from "./CardSection";

export default function MainContent() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 md:py-5">
      <GreetingSection />
      <CardSection />
    </main>
  );
}
