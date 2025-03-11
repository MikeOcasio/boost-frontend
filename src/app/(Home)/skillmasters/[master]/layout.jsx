// METADATA
export async function generateMetadata({ params }) {
  return {
    title: "RavenBoost Skillmaster",
    description: "Explore skillmaster details and boost options.",
    openGraph: {
      type: "article",
      locale: "en_US",
      url: `https://www.ravenboost.com/skillmasters/${params.master}`,
      title: "RavenBoost Skillmaster",
      description: "Explore skillmaster details and boost options.",
      images: [
        {
          url: "/skillmasters/hero.png",
          width: 1200,
          height: 630,
          alt: "RavenBoost Skillmaster",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "RavenBoost Skillmaster",
      description: "Explore skillmaster details and boost options.",
      images: [
        {
          url: "/skillmasters/hero.png",
          width: 1200,
          height: 630,
          alt: "RavenBoost Skillmaster",
        },
      ],
    },
  };
}

const SkillmasterLayout = ({ children }) => {
  return <>{children}</>;
};

export default SkillmasterLayout;
