export type Article = {
  Data: ArticleItem[];
};

export type ArticleItem = {
  TYPE: string;
  ID: number;
  GUID: string;
  PUBLISHED_ON: number;
  IMAGE_URL: string;
  TITLE: string;
  SUBTITLE: null;
  AUTHORS: string;
  URL: string;
  SOURCE_ID: number;
  BODY: string;
  KEYWORDS: string;
  LANG: string;
  UPVOTES: number;
  DOWNVOTES: number;
  SCORE: number;
  SENTIMENT: string;
  STATUS: string;
  CREATED_ON: number;
  UPDATED_ON: number;
  SOURCE_DATA: {
    TYPE: string;
    ID: number;
    SOURCE_KEY: string;
    NAME: string;
    IMAGE_URL: string;
    URL: string;
    LANG: string;
    SOURCE_TYPE: string;
    LAUNCH_DATE: null;
    SORT_ORDER: number;
    BENCHMARK_SCORE: number;
    STATUS: string;
    LAST_UPDATED_TS: number; // Thu May 22 2025 20:44:11 GMT+0100 (West Africa Standard Time)
    CREATED_ON: number;
    UPDATED_ON: number;
  };
  CATEGORY_DATA: [
    {
      TYPE: string;
      ID: number;
      NAME: string;
      CATEGORY: string;
    }
  ];
};
