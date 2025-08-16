import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  PaintBrushIcon
} from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router";
import BackButton from "@/components/Shared/BackButton";
import PageLayout from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";

const GroupSettings = () => {
  const { address } = useParams<{ address: string }>();

  const settingsPages = [
    {
      icon: <PaintBrushIcon className="size-5" />,
      title: "Personalize",
      url: `/g/${address}/settings/personalize`
    },
    {
      icon: <CurrencyDollarIcon className="size-5" />,
      title: "Monetize",
      url: `/g/${address}/settings/monetize`
    },
    {
      icon: <AdjustmentsHorizontalIcon className="size-5" />,
      title: "Rules",
      url: `/g/${address}/settings/rules`
    }
  ];

  return (
    <PageLayout title="Settings">
      <Card>
        <CardHeader
          icon={<BackButton path={`/g/${address}`} />}
          title="Settings"
        />
        <div className="py-3">
          {settingsPages.map((page) => (
            <Link
              className="flex items-center justify-between px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
              key={page.url}
              to={page.url}
            >
              <div className="flex items-center space-x-2">
                {page.icon}
                <div>{page.title}</div>
              </div>
              <div>
                <ArrowRightIcon className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </PageLayout>
  );
};

export default GroupSettings;
