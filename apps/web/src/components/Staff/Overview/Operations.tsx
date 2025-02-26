import Loader from "@components/Shared/Loader";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import camelCaseToReadable from "@hey/helpers/camelCaseToReadable";
import { Card, CardHeader, ErrorMessage, NumberedStat } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";

const GET_INTERNAL_OPERATIONS_QUERY_KEY = "getInternalOperations";

const Operations: FC = () => {
  const getInternalOperations = async (): Promise<
    { operation: string; count: number }[]
  > => {
    try {
      const { data } = await axios.get(
        `${HEY_API_URL}/internal/stats/operations`,
        { headers: getAuthApiHeaders() }
      );

      return data.result;
    } catch {
      return [];
    }
  };

  const { data, isLoading, error } = useQuery({
    queryFn: getInternalOperations,
    queryKey: [GET_INTERNAL_OPERATIONS_QUERY_KEY],
    refetchInterval: 5000
  });

  return (
    <Card>
      <CardHeader title="Operations" />
      <div className="m-5">
        {isLoading ? (
          <Loader className="my-10" message="Loading operations..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load operations" />
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {data?.map((operation) => (
              <NumberedStat
                key={operation.operation}
                count={operation.count.toString()}
                name={camelCaseToReadable(operation.operation)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Operations;
