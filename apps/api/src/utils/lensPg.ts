import logger from "@hey/helpers/logger";
import dotenv from "dotenv";
import type { IDatabase, IFormatting, IHelpers, IMain } from "pg-promise";
import pgPromise from "pg-promise";
import type pg from "pg-promise/typescript/pg-subset";
import type { IConnectionParameters } from "pg-promise/typescript/pg-subset";

dotenv.config({ override: true });

type DatabaseInstance = IDatabase<unknown, pg.IClient>;

interface InitializeDbResult {
  instance: DatabaseInstance;
  pg: IMain<unknown, pg.IClient>;
}

type DatabaseParams = null | Record<string, unknown>;
type DatabaseQuery = string;

class Database {
  private _connectionBase: IConnectionParameters = {
    connectionString: process.env.LENS_DATABASE_URL,
    idleTimeoutMillis: 30000,
    max: 15
  };

  private _readDb: DatabaseInstance;
  public as: IFormatting;
  public helpers: IHelpers;

  constructor() {
    const readDb = this._initializeDb();
    this._readDb = readDb.instance;
    this.helpers = readDb.pg.helpers;
    this.as = readDb.pg.as;
  }

  private _initializeDb(): InitializeDbResult {
    return this._createDbInstance(this._connectionBase);
  }

  private _createDbInstance(
    connectionParameters: IConnectionParameters
  ): InitializeDbResult {
    const pgp = pgPromise({
      error: (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        logger.error(`LENS POSTGRES ERROR WITH TRACE: ${errorMessage}`);
      }
    });

    return {
      instance: pgp(connectionParameters),
      pg: pgp
    };
  }

  public multi<T = unknown>(
    query: DatabaseQuery,
    params: DatabaseParams = null
  ): Promise<T[][]> {
    return this._readDb.multi<T>(query, params);
  }

  public query<T = unknown>(
    query: DatabaseQuery,
    params: DatabaseParams = null
  ): Promise<T> {
    return this._readDb.query<T>(query, params);
  }
}

export default new Database();
