import { useState } from 'react';
import { HeroMode } from './components/hero/PandaCanvas';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { PrinciplesSection } from './components/sections/PrinciplesSection';
import { JourneySection } from './components/sections/JourneySection';
import { PhilosophyModal } from './components/sections/PhilosophyModal';
import { Footer } from './components/footer/Footer';
import { WujiCursor } from './components/effects/WujiCursor';

export function App() {
  const [mode, setMode] = useState<HeroMode>('meditation');
  const [philosophyOpen, setPhilosophyOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-crimson-950 text-ivory-100 selection:bg-gold-500/30 selection:text-gold-200">
      {/* Primordial Wuji Chi Energy Custom Cursor */}
      <WujiCursor />

      {/* 1. Global Navigation */}
      <Navbar
        onOpenPhilosophy={() => setPhilosophyOpen(true)}
      />

      {/* 2. Hero Section (WebGL, Interactive Look Panda, Cloth Banner, Editorial Content) */}
      <HeroSection
        mode={mode}
        onModeChange={setMode}
        onOpenPhilosophy={() => setPhilosophyOpen(true)}
      />

      {/* 3. Section 2: Core Principles (Balance, Focus, Discipline) */}
      <PrinciplesSection />

      {/* 4. Section 3: From Stillness to Strength (Breathe, Observe, Act) */}
      <JourneySection />

      {/* 5. Philosophy Modal Dialog */}
      <PhilosophyModal
        isOpen={philosophyOpen}
        onClose={() => setPhilosophyOpen(false)}
      />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}

export default App;
