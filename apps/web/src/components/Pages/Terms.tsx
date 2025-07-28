import ReactMarkdown from "react-markdown";
import { Link } from "react-router";
import terms from "@/assets/terms.md?raw";
import PageHeader from "@/components/Pages/PageHeader";
import PageLayout from "@/components/Shared/PageLayout";
import { H4 } from "@/components/Shared/UI";

const Terms = () => {
  const updatedAt = "March 21, 2025";

  return (
    <PageLayout title="Terms & Conditions">
      <PageHeader title="Terms & Conditions" updatedAt={updatedAt} />
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg">
            <div className="!p-8 max-w-none text-gray-500 dark:text-gray-200">
              <ReactMarkdown
                components={{
                  a: ({ href = "#", children }) => (
                    <Link to={href}>{children}</Link>
                  ),
                  h2: ({ node, ...props }) => (
                    <H4 className="mt-8 mb-5" {...props}>
                      {props.children}
                    </H4>
                  ),
                  li: ({ node, ...props }) => (
                    <li className="leading-7" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="leading-7" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-inside list-disc space-y-3"
                      {...props}
                    />
                  )
                }}
              >
                {terms}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Terms;
