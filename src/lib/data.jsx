import {
  ShieldCheckIcon,
  ShoppingBagIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid";
import { GiProgression } from "react-icons/gi";
import { MdAssignment } from "react-icons/md";

import APEX from "@/images/photos/apexLogo.png";
import DESTINY from "@/images/photos/destinyLogo.png";
import COD from "@/images/photos/codLogo.png";

export const games = [
  {
    name: "Destiny 2",
    id: 1,
    slug: "game-destiny-2",
    href: "#",
    isActive: false,
    mostPopular: true,
    tagLine: "Dominate the Destiny 2 Universe",
    description:
      "Mention the custom boosting services for leveling, raid completions, and exotic quests with the assistance of experienced players.",
    features: [
      "Custom boosting services for leveling",
      "Raid completions",
      "Exotic quests assistance",
      "PVP Glory ranks boost",
    ],
    image: DESTINY,
    altText: "logo for Destiny 2",
    bgImage: "/apex-game-bg.png",
    primaryColor: "#c2bbb2",
  },
  {
    name: "Apex Legends",
    id: 2,
    slug: "game-apex-legends",
    href: "#",
    isActive: false,
    mostPopular: true,
    tagLine: "Elevate Your Apex Legends Experience",
    description:
      "Highlight the opportunity to boost rankings, improve kill/death ratios (K/D), and level up faster with the help of top-tier players.",
    features: [
      "Custom boosting services for leveling",
      "Rank boosting",
      "Kill/death ratio improvement",
      "Level up faster",
    ],
    image: APEX,
    altText: "logo for Apex Legends",
    bgImage: "/apex-game-bg.png",
    primaryColor: "#FF0202",
  },
  {
    name: "Call of Duty",
    id: 3,
    slug: "game-call-of-duty",
    href: "#",
    isActive: false,
    mostPopular: true,
    tagLine: "Achieve Call of Duty Supremacy",
    description:
      "Focus on the boost services for multiplayer and Warzone, including rank boosting, weapon leveling, and unlocking achievements.",
    features: [
      "Custom boosting services for multiplayer and Warzone",
      "Rank boosting",
      "Weapon leveling",
      "Achievement unlocking",
    ],
    image: COD,
    altText: "logo for Call of Duty",
    bgImage: "/apex-game-bg.png",
    primaryColor: "#688823",
  },
];

export const people = [
  {
    name: "iShardTV",
    role: "Skill Master",
    imageUrl: "/skillmasters/skillmaster1.webp",
    xUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "iMarshTV",
    role: "Skill Master",
    imageUrl: "/skillmasters/skillmaster2.webp",
    xUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "kyomizuuu",
    role: "Skill Master",
    imageUrl: "/skillmasters/skillmaster3.webp",
    xUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "xoKuraii",
    role: "Skill Master",
    imageUrl: "/skillmasters/skillmaster4.webp",
    xUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Halaven",
    role: "Skill Master",
    imageUrl: "/skillmasters/skillmaster5.webp",
    xUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "xFlight On Kick",
    role: "Skill Master",
    imageUrl: "/skillmasters/skillmaster6.webp",
    xUrl: "#",
    linkedinUrl: "#",
  },
];

export const faqs = [
  {
    question:
      "Is my personal information and gaming account information safe with you?",
    answer:
      "Yes, your information is safe. We prioritize security and confidentiality for all our customers.",
  },
  {
    question: "Do I need to share my gaming account login details with you?",
    answer:
      "Yes, but rest assured your details are kept secure and are only used for the duration of the service.",
  },
  {
    question: "What if I have questions or concerns about my order?",
    answer:
      "You can contact our support team anytime. We're here to help with any questions or concerns you might have.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer a satisfaction guarantee. If you're not happy with our service, contact us for a resolution.",
  },
];

export const steps = [
  {
    title: "Create Profile",
    description: "Sign up and create your profile to get started.",
    icon: <UserPlusIcon className="h-10 w-10 text-Gold" />,
  },
  {
    title: "Place Order",
    description: "Choose the service you need and place an order.",
    icon: <ShoppingBagIcon className="h-10 w-10 text-Plum" />,
  },
  {
    title: "Booster Assigned",
    description: "A booster is assigned to your order and starts the process.",
    icon: <MdAssignment className="h-10 w-10 text-Gold" />,
  },
  {
    title: "Track Progress",
    description: "Monitor the progress of your order through your profile.",
    icon: <GiProgression className="h-10 w-10 text-Plum" />,
  },
  {
    title: "Review and Approve",
    description: "Once completed, review the results and approve.",
    icon: <ShieldCheckIcon className="h-10 w-10 text-Gold" />,
  },
];

export const orders = [
  {
    id: 1,
    order_id: 1,
    internal_id: 1,
    product: [
      {
        product_id: "COD",
        product_name: "COD",
        quantity: 1,
        price: "100",
        platform: "PS",
        skill_master_id: "Nikhil",
        image_url: "/badges/kill.png",
      },
      {
        product_id: "COD",
        product_name: "COD",
        quantity: 2,
        price: "100",
        platform: "PS",
        skill_master_id: "Nikhil",
        image_url: "/badges/kill.png",
      },
      {
        product_id: "COD",
        product_name: "COD",
        quantity: 1,
        price: 100,
        platform: "PS",
        skill_master_id: "Nikhil",
        image_url: "/badges/kill.png",
      },
    ],
    open:true,
    
    total_price: 100,
    order_status: "Pending",
    payment_status: "paid",
    promotion_id: "10",
    tax: "0.1",
    date: "2023-03-01",
  },
  {
    id: 2,
    order_id: 2,
    internal_id: 2,
    product: [
      {
        product_id: "COD",
        product_name: "COD",
        quantity: 2,
        price: 100,
        platform: "PS",
        skill_master_id: "Nikhil",
        image_url: "/game/apex.png",
      },
    ],
    total_price: 100,
    order_status: "Pending",
    payment_status: "paid",
    promotion_id: "10",
    tax: "0.1",
    date: "2023-03-01",
  },
  {
    id: 3,
    order_id: 3,
    internal_id: 3,
    product: [
      {
        product_id: "COD",
        product_name: "COD",
        quantity: 3,
        price: 100,
        platform: "PS",
        skill_master_id: "Nikhil",
        image_url: "/game/destiny.png",
      },
    ],
    total_price: 100,
    order_status: "Pending",
    payment_status: "paid",
    promotion_id: "10",
    tax: "0.1",
    date: "2023-03-01",
  },
  {
    id: 4,
    order_id: 4,
    internal_id: 4,
    product: [
      {
        product_id: "COD",
        product_name: "COD",
        quantity: 4,
        price: 100,
        platform: "PS",
        skill_master_id: "Nikhil",
        image_url: "/game/cod.png",
      },
    ],
    total_price: 100,
    order_status: "Pending",
    payment_status: "paid",
    promotion_id: "10",
    tax: "0.1",
    date: "2023-03-01",
  },
];
