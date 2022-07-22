import request from "@/utils/request";

export const getSearchSuggestion = (q) => {
  return request({
    url: "/v1_0/suggestion",
    params: { q }
  });
};

export const getSearchResult = (params) => {
  return request({
    url: "/v1_0/search",
    params
  });
};
