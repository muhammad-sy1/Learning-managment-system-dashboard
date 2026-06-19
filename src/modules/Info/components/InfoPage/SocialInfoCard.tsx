import { ReusableCard } from "@/components/ReusableCard";
import { Facebook, Instagram } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ISocialInfo } from "../../types/info";
import { FaWhatsapp } from "react-icons/fa";

const SocialInfoCard = ({ data }: { data: ISocialInfo }) => {
  const t = useTranslations("Dashboard.InfoPage");
  const socials = [
    {
      key: "facebook",
      title: "Facebook",
      icon: <Facebook className="h-5 w-5 text-blue-600" />,
      value: data?.facebook,
      color: "text-blue-600 hover:text-blue-800",
    },
    {
      key: "instagram",
      title: "Instagram",
      icon: <Instagram className="h-5 w-5 text-pink-600" />,
      value: data?.instagram,
      color: "text-pink-600 hover:text-pink-800",
    },
    {
      key: "whatsapp",
      title: "WhatsApp",
      icon: <FaWhatsapp className="h-5 w-5 text-green-600" />,
      value: data?.whatsapp,
      color: "text-green-600 hover:text-green-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {socials.map((item) => (
        <ReusableCard key={item.key} title={item.title} icon={item.icon}>
          {item.value ? (
            <Link
              href={item.value}
              target="_blank"
              className={`break-all ${item.color}`}
            >
              {item.value}
            </Link>
          ) : (
            <span className="text-gray-400">{t("social.notSet")}</span>
          )}
        </ReusableCard>
      ))}
    </div>
  );
};

export default SocialInfoCard;
