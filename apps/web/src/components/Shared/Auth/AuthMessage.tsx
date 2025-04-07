import { H4 } from "@/components/Shared/UI";

interface AuthMessageProps {
  description: string;
  title: string;
}

const AuthMessage = ({ description, title }: AuthMessageProps) => (
  <div className="space-y-2">
    <H4>{title}</H4>
    <div className="text-gray-500 text-sm dark:text-gray-200">
      {description}
    </div>
  </div>
);

export default AuthMessage;
