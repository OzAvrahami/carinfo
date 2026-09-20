const API_URL = "https://data.gov.il/api/3/action/datastore_search";
const TIMEOUT_MS =15_000;

export async function searchRecords({
    resourceId,
    filters = {},
    limit = 100,
    offset = 0,
    sort,
}) {
    const url = new URL(API_URL);

    url.searchParams.set("resource_id", resourceId);
    url.searchParams.set("filters", JSON.stringify(filters));
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));

    if (sort) {
        url.searchParams.set("sort", sort);
    }

    // Limit the time spent waiting for the request.
    const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
        console.error("Request URL:", url.toString());
        console.error("Response URL:", response.url);
        console.error("Response body:", (await response.text()).slice(0, 1000));
        throw new Error("Data.gov returned HTTP " + response.status + ".");
    }

    const data = await response.json();

    if (data?.success !== true) {
        throw new Error("Data.gov reported an API failure.");
    }

    if (!Array.isArray(data.result?.records)) {
        throw new Error("Data.gov returned an unexpected response.");
    }

    // Keep the records and pagination metadata together.
    return data.result;
}