import Hero from './Home/Hero';
import CollectionShowcase from './Home/CollectionShowcase';
import LookSlider from './Home/LookSlider';
import Stickygallerysection from './Home/Stickygallerysection';
import HeroFullscreen from './Home/HeroFullscreenSection';
import OurLifeAsFriends from './Home/Ourlifeasfriends';
import Stayintheloop from './Home/Stayintheloop';

export default function Home() {
  return (
    <main>
      <Hero />
     <CollectionShowcase />
      <LookSlider />
      <Stickygallerysection />
      <HeroFullscreen />
      <OurLifeAsFriends />
      <Stayintheloop />  
    </main>
  );
}