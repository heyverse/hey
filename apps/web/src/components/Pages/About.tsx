import { PageLayout } from "@/components/Shared/PageLayout";
import { Card, H2, H3 } from "@/components/Shared/UI";

const About = () => {
  return (
    <PageLayout title="About Hey">
      <div className="flex h-48 w-full items-center justify-center rounded-none bg-gradient-to-r from-purple-500 to-indigo-500 md:rounded-xl">
        <div className="relative text-center">
          <H2 className="text-white">About Hey</H2>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mx-auto max-w-2xl space-y-6 p-8 text-gray-500 dark:text-gray-200">
          <Card className="p-6 text-center">
            <H3 className="mb-2">Decentralised Social Media</H3>
            <p className="leading-7">
              Hey is a modern social network built on Lens Protocol. Our goal is
              to empower creators and foster rich conversations in an open
              ecosystem.
            </p>
          </Card>
          <Card className="p-6 text-center">
            <H3 className="mb-2">Open Source</H3>
            <p className="leading-7">
              We believe in transparent development. You can explore our code,
              contribute and help us shape the future of social media.
            </p>
          </Card>
          <Card className="p-6 text-center">
            <H3 className="mb-2">Community First</H3>
            <p className="leading-7">
              From our Discord server to regular feature requests, every user
              plays a part in making Hey better.
            </p>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
