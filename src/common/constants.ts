export const baseUrl = process.env.BASE_URL as string;

const nodeEnv = process.env.NODE_ENV as string;

export const apiUrl = baseUrl + '/api/v1/' + nodeEnv;
