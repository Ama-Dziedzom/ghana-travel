import { 
  Sun, 
  MapPin, 
  Wallet, 
  ShieldCheck, 
  Smartphone, 
  Briefcase, 
  Globe 
} from "lucide-react";

const TravelTipsPage = () => {
  const tips = [
    {
      icon: <Sun className="text-accent" />,
      title: "Best time to visit Ghana",
      content: "The best time to visit is during the dry season, from November to March, when the weather is slightly cooler and the humidity is more manageable. December is particularly vibrant as many Ghanaians living abroad return home for the festive season."
    },
    {
      icon: <MapPin className="text-accent" />,
      title: "Getting around",
      content: "In Accra, Uber and Bolt are reliable and safe. For the local experience, try a 'trotro'—minibuses that go everywhere for very cheap. For long-distance travel, STC buses are air-conditioned and comfortable. If you're feeling adventurous, hire a private car for day trips."
    },
    {
      icon: <Wallet className="text-accent" />,
      title: "Money & Mobile Money (MoMo)",
      content: "Ghana is increasingly a cashless society thanks to Mobile Money (MoMo). MTMoMo and Vodafone Cash are used for everything from street food to taxi fares. While major hotels take cards, always have some Ghana Cedis (GHS) on you. ATMs are plentiful in cities."
    },
    {
      icon: <ShieldCheck className="text-accent" />,
      title: "Safety & health basics",
      content: "Ghana is known as one of Africa's safest countries. However, practice common sense in crowded markets. Health-wise, a yellow fever vaccination certificate is mandatory for entry. Malaria prophylaxis is highly recommended. Only drink bottled or filtered water."
    },
    {
      icon: <Smartphone className="text-accent" />,
      title: "SIM cards & data connectivity",
      content: "Pick up an MTN or Vodafone SIM card at the airport (Kotoka International Airport). You'll need your passport to register it. Data packages are affordable and provide decent coverage in most southern and central regions."
    },
    {
      icon: <Briefcase className="text-accent" />,
      title: "Packing list",
      content: "Pack light, breathable cotton or linen clothing. Ghana is hot year-round. Bring a hat, sunscreen, and good insect repellent. Don't forget a universal adapter (Ghana uses Type G, like the UK) and a good pair of walking shoes for coastal tours."
    },
    {
      icon: <Globe className="text-accent" />,
      title: "Visa requirements",
      content: "Most visitors require a visa before flying to Ghana. Check the latest requirements on the official Ghana Immigration Service website or your local embassy. Some ECOWAS citizens and a few others are exempt."
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-24 space-y-4">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Practical Wisdom</span>
          <h1 className="font-display text-5xl md:text-6xl text-text leading-tight">
            Travel Tips for Ghana
          </h1>
          <p className="font-body text-muted text-lg leading-relaxed">
            Everything you need to know before you touch down in the center of the world. Practical, personal, and straight from the source.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
          {tips.map((tip, i) => (
            <div key={i} className="space-y-6 group">
              <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-sm transition-transform group-hover:scale-110 duration-300">
                {tip.icon}
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-2xl text-text group-hover:text-accent transition-colors">
                  {tip.title}
                </h2>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {tip.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Summary */}
        <div className="mt-24 p-12 bg-text text-bg rounded-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display text-3xl">Ready to go?</h3>
            <p className="font-body text-bg/60 text-sm italic">"Akwaaba" means welcome. We can't wait to see you.</p>
          </div>
          <a 
            href="/itineraries" 
            className="px-8 py-4 bg-accent text-white font-body text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-text transition-all"
          >
            Check our Itineraries
          </a>
        </div>
      </div>
    </div>
  );
};

export default TravelTipsPage;
