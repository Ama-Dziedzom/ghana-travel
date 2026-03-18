import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="pt-32 pb-24">
      {/* Hero Content */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Our Story</span>
                <h1 className="font-display text-5xl md:text-7xl text-text leading-tight">
                  Ghana. <br /> In its truest form.
                </h1>
              </div>
              <p className="font-body text-lg text-muted leading-relaxed max-w-xl italic">
                "We believe that West Africa is not a destination to be managed, but a soul to be experienced. We're here to bridge the gap between curiosity and connection."
              </p>
            </div>
            <div className="relative aspect-[4/5] bg-border overflow-hidden rounded-sm shadow-2xl">
              <Image
                src="/images/about_ghana.png"
                alt="Ghanaian Market"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="bg-border/20 py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-6">
            <h2 className="font-display text-4xl text-text border-l-4 border-accent pl-8">The Mission</h2>
            <p className="font-body text-lg text-text/80 leading-relaxed pl-8">
              This blog was born out of a desire to showcase Ghana beyond the typical tourist brochures. We want to celebrate the rhythm of the ordinary—the way the sun hits the whitewashed walls of Elmina, the specific sound of a mortar and pestle in a backyard kitchen, and the infectious energy of Accra at midnight.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-4xl text-text border-l-4 border-accent pl-8">Why "Ghana First"?</h2>
            <p className="font-body text-lg text-text/80 leading-relaxed pl-8">
              In a world of fast travel and checklist tourism, we advocacy for "Slow Ghana." We want you to arrive as a visitor but stay long enough to feel like a friend. Our guides are curated by locals and frequent travelers who have spent years navigating the Trotros, eating at the best chop bars, and finding the quietest stretches of sand along the Atlantic.
            </p>
          </div>
        </div>
      </section>

      {/* Contributors */}
      <section className="py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">The People</span>
             <h2 className="font-display text-4xl md:text-5xl">Meet the Contributors</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="space-y-6 text-center">
              <div className="relative w-32 h-32 mx-auto overflow-hidden rounded-full border-2 border-accent/20">
                <Image src="/images/contributor_ama.png" alt="Ama Serwaa" fill className="object-cover" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl text-text">Ama Serwaa</h3>
                <p className="font-body text-[10px] uppercase font-bold tracking-widest text-accent">Founder & Editor</p>
                <p className="font-body text-sm text-muted leading-relaxed">
                  A writer and culture enthusiast based between Accra and London. Ama has a weakness for street-side Jollof and vintage highlife records.
                </p>
              </div>
            </div>

            <div className="space-y-6 text-center">
              <div className="relative w-32 h-32 mx-auto overflow-hidden rounded-full border-2 border-accent/20">
                <Image src="/images/contributor_kofi.png" alt="Kofi Mensah" fill className="object-cover" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl text-text">Kofi Mensah</h3>
                <p className="font-body text-[10px] uppercase font-bold tracking-widest text-accent">Lead Photographer</p>
                <p className="font-body text-sm text-muted leading-relaxed">
                  Capturing the soul of West Africa through his lens for over a decade. Kofi knows exactly where to find the best light in the Central Region.
                </p>
              </div>
            </div>

            <div className="space-y-6 text-center">
              <div className="relative w-32 h-32 mx-auto overflow-hidden rounded-full border-2 border-accent/20">
                <Image src="/images/contributor_naa.png" alt="Naa Ayeley" fill className="object-cover" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl text-text">Naa Ayeley</h3>
                <p className="font-body text-[10px] uppercase font-bold tracking-widest text-accent">Culinary Expert</p>
                <p className="font-body text-sm text-muted leading-relaxed">
                  A chef and food historian dedicated to preserving traditional Ghanaian recipes while simplifying them for the modern kitchen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
