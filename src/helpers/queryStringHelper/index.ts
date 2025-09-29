import queryString from "query-string";
import type { StringifiableRecord } from "query-string";

type QueriedUrl = {
  url: string;
  query: StringifiableRecord;
};

export function getQueriedUrl({ url, query }: QueriedUrl) {
  return queryString.stringifyUrl(
    { url: url, query: query },
    {
      arrayFormat: "comma",
      skipEmptyString: true,
      skipNull: true,
    }
  );
}
