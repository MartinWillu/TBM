import { http, HttpResponse } from "msw";

export const handlers = [
    http.get(`backend/api/store`, () => {
        return HttpResponse.json({
            success: true,
            message: "MOCKED!"
        });
    }),
];