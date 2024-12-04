import {
  ShieldCheckIcon,
  ShoppingBagIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid";
import { GiProgression } from "react-icons/gi";
import { MdAssignment } from "react-icons/md";

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

export const adminOrderStatus = [
  { name: "Open", value: "open" },
  { name: "Assigned", value: "assigned" },
  { name: "Delayed", value: "delayed" },
  { name: "Disputed", value: "disputed" },
  { name: "Re Assigned", value: "re_assigned" },
  { name: "In Progress", value: "in_progress" },
  { name: "Complete", value: "complete" },
];

export const orderStatus = [
  { name: "In Progress", value: "in_progress" },
  { name: "Delayed", value: "delayed" },
  { name: "Disputed", value: "disputed" },
  { name: "Assigned", value: "assigned" },
  { name: "Complete", value: "complete" },
];
