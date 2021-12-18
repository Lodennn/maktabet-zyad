import { HttpDataStatus } from "../constants";

export interface HttpInitialState {
  isLoading: boolean;
  error: string | null;
  data: (string | number)[];
}
export interface FetchData {
  type: HttpDataStatus.FETCHING;
}

export interface SuccessFetchData {
  type: HttpDataStatus.SUCCESS;
  payload: { data: (string | number)[] };
}

export interface FailedFetchData {
  type: HttpDataStatus.ERROR;
  payload: { error: string };
}
