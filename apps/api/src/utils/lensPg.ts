import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ override: true });

const sql = postgres(process.env.LENS_DATABASE_URL ?? "", {
  max: 50,
  idle_timeout: 50
});

type DatabaseParams = unknown[] | null;
type DatabaseQuery = string;

class Database {
  public query(
    query: DatabaseQuery,
    params: DatabaseParams = null
  ): Promise<any[]> {
    return sql.unsafe(query, (params ?? []) as any[]) as unknown as Promise<
      any[]
    >;
  }

  public multi(
    query: DatabaseQuery,
    params: DatabaseParams = null
  ): Promise<any[][]> {
    return sql.unsafe(query, (params ?? []) as any[]) as unknown as Promise<
      any[][]
    >;
  }
}

export default new Database();
