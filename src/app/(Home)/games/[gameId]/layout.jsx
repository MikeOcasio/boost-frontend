import { fetchGameById } from "@/lib/actions/products-action";

// METADATA
export async function generateMetadata({ params }) {
  const game = await fetchGameById(params.gameId); // Fetch the game data
  return {
    title: `${game?.name} | ${game?.category?.name}` || "RavenBoost Game",
    description: game?.tag_line || "Explore game details and boost options.",
    openGraph: {
      type: "article",
      locale: "en_US",
      url: `https://ravenboost.com/game?s/${game?.id}`,
      title: game?.name,
      description: game?.tag_line,
      images: [
        {
          url: game?.image,
          width: 1200,
          height: 630,
          alt: game?.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: game?.name,
      description: game?.tag_line,
      images: [
        {
          url: game?.image,
          width: 1200,
          height: 630,
          alt: game?.name,
        },
      ],
    },
  };
}

const GameLayout = ({ children }) => {
  return <>{children}</>;
};

export default GameLayout;
