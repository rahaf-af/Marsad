import { fetchJson } from '../../shared/lib/http';
import type { Meta, QuarterData, TimeseriesPoint } from './types';

// BASE_URL keeps the paths right if the site is deployed under a sub-path (e.g. GitHub Pages).
const DATA_URL = `${import.meta.env.BASE_URL}data`;

export const laborApi = {
    meta: (signal?: AbortSignal) => fetchJson<Meta>(`${DATA_URL}/meta.json`, signal),
    timeseries: (signal?: AbortSignal) =>
        fetchJson<TimeseriesPoint[]>(`${DATA_URL}/timeseries.json`, signal),
    quarter: (period: string, signal?: AbortSignal) =>
        fetchJson<QuarterData>(`${DATA_URL}/quarters/${period}.json`, signal),
};