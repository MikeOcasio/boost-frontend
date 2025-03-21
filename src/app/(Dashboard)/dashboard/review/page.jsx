import Link from "next/link";
import ReviewCard from "../admin/_components/review-card";

// Add more mock data for better presentation
const mockReviews = {
  website: [
    {
      id: 1,
      rating: 4.5,
      comment:
        "Great platform for boosting services! The interface is intuitive and support team is responsive.",
      date: "2024-03-20",
      type: "website",
      link: "/",
    },
    {
      id: 4,
      rating: 5,
      comment:
        "Best boosting platform I've used so far. Very secure and reliable.",
      date: "2024-03-19",
      type: "website",
      link: "/",
    },
  ],
  products: [
    {
      id: 2,
      rating: 5,
      comment:
        "Excellent Mythic+ boost package, achieved my goals quickly and professionally",
      date: "2024-03-15",
      productName: "Mythic+ Boost",
      productId: "p123",
      link: "/products/1",
    },
    {
      id: 5,
      rating: 4.5,
      comment: "Great raid boost service, very smooth run",
      date: "2024-03-14",
      productName: "Raid Boost",
      productId: "p124",
      link: "/products/2",
    },
  ],
  skillmasters: [
    {
      id: 3,
      rating: 4,
      comment:
        "Very professional and friendly booster, great communication throughout",
      date: "2024-03-18",
      skillmasterName: "Pro Booster",
      skillmasterId: "sm456",
      link: "/skillmasters/2",
    },
  ],
};

const quickLinksData = [
  { href: "/#review", text: "Review Website", icon: "🌐" },
  { href: "/products#review", text: "Review Products", icon: "📦" },
  {
    href: "/skillmasters#review",
    text: "Review Skillmasters",
    icon: "👨‍💻",
  },
];

const QuickLinks = () => (
  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
    <h2 className="text-xl font-bold mb-6">Quick Review Links</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {quickLinksData.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center justify-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-200"
        >
          <span className="text-xl">{link.icon}</span>
          <span className="font-medium">{link.text}</span>
        </Link>
      ))}
    </div>
  </div>
);

const ReviewPage = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold mb-8">Your Reviews</h1>

      <QuickLinks />

      <ReviewCard
        title="Website Reviews"
        reviews={mockReviews.website}
        type="website"
        pageLink="/#review"
      />

      <ReviewCard
        title="Product Reviews"
        reviews={mockReviews.products}
        type="products"
        pageLink="/products#review"
      />

      <ReviewCard
        title="Skillmaster Reviews"
        reviews={mockReviews.skillmasters}
        type="skillmasters"
        pageLink="/skillmasters#review"
      />
    </div>
  );
};

export default ReviewPage;
