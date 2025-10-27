import queryString from "query-string";
import type { StringifiableRecord } from "query-string";

export type StringifiableRecordType = StringifiableRecord;

type QueriedUrl = {
  url: string;
  query: StringifiableRecordType;
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