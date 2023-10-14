export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV as string;

export const apiUrl = baseUrl + '/api/v1/' + nodeEnv;
