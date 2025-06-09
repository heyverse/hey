import { PageLayout } from "@/components/Shared/PageLayout";
import { Card, H2, H3 } from "@/components/Shared/UI";
import { motion } from "motion/react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.2 }
  })
};

const features = [
  {
    title: "Decentralised Social Media",
    description:
      "Hey is a modern social network built on Lens Protocol. Our goal is to empower creators and foster rich conversations in an open ecosystem."
  },
  {
    title: "Open Source",
    description:
      "We believe in transparent development. You can explore our code, contribute and help us shape the future of social media."
  },
  {
    title: "Community First",
    description:
      "From our Discord server to regular feature requests, every user plays a part in making Hey better."
  }
];

const About = () => {
  return (
    <PageLayout title="About Hey">
      <motion.div
        className="gradient-animation flex h-48 w-full items-center justify-center rounded-none bg-gradient-to-r from-purple-500 to-indigo-500 md:rounded-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative text-center">
          <H2 className="text-white">About Hey</H2>
        </div>
      </motion.div>
      <div className="flex justify-center">
        <div className="mx-auto max-w-2xl space-y-6 p-8 text-gray-500 dark:text-gray-200">
          {features.map(({ title, description }, index) => (
            <motion.div
              key={title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <Card className="bg-white/70 p-6 text-center backdrop-blur-md dark:bg-gray-900/50">
                <H3 className="mb-2">{title}</H3>
                <p className="leading-7">{description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
