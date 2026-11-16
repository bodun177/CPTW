import { mockSearchService } from './mockSearchService.js';
import { createApiSearchService } from './apiSearchService.js';

export const dataSource = process.env.REACT_APP_DATA_SOURCE ?? 'mock';

function selectService() {
  if (dataSource === 'mock') return mockSearchService;
  if (dataSource === 'api') {
    return createApiSearchService(process.env.REACT_APP_API_BASE_URL);
  }
  throw new Error(`Unsupported data source: ${dataSource}`);
}

export const searchService = selectService();
