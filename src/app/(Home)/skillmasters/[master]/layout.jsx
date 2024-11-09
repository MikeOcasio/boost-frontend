import { fetchSkillmasterById } from "@/lib/actions/user-actions";

// METADATA
export async function generateMetadata({ params }) {
  const skillMaster = await fetchSkillmasterById(params.master); // Fetch the skill master data
  return {
    title:
      `${skillMaster?.gamer_tag || "Skillmaster#" + skillMaster?.id}` ||
      "RavenBoost Skillmaster",
    description:
      skillMaster?.bio || "Explore skillmaster details and boost options.",
    openGraph: {
      type: "article",
      locale: "en_US",
      url: `https://ravenboost.com/skillmaster?s/${skillMaster?.id}`,
      title: skillMaster?.gamer_tag,
      description: skillMaster?.bio,
      images: [
        {
          url: skillMaster?.image_url,
          width: 1200,
          height: 630,
          alt: skillMaster?.gamer_tag,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: skillMaster?.gamer_tag,
      description: skillMaster?.bio,
      images: [
        {
          url: skillMaster?.image_url,
          width: 1200,
          height: 630,
          alt: skillMaster?.gamer_tag,
        },
      ],
    },
  };
}

const SkillmasterLayout = ({ children }) => {
  return <>{children}</>;
};

export default SkillmasterLayout;
