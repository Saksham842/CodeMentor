import { PageTransition } from "../animations/PageTransition";
import { FloatingOrb } from "../animations/FloatingOrb";

export function PageWrapper({ children }) {
  return (
    <PageTransition>
      <div className="relative min-h-[calc(100vh-64px)] p-6 md:p-8 z-10">
        <FloatingOrb color="nebula" className="-top-20 -right-20" />
        <FloatingOrb color="cosmic" className="-bottom-20 -left-20" />
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </PageTransition>
  );
}

export default PageWrapper;
