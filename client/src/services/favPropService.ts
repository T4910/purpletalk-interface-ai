import request from "@/lib/request";
import * as endpoints from "@/services/endpoints";
import * as t from "@/services/types"


export const getFavoriteProperties = () => {
    return request.get<t.TFavoriteProperty[]>(endpoints.getFavoriteProperties());
}

export const getFavoritePropertyByUrl = (url: string) => {
    return request.get<t.TFavoriteProperty>(endpoints.getFavoritePropertiesByUrl(url));
}

export const getFavoriteProperty = (id: string) => {
    return request.get<t.TFavoriteProperty>(endpoints.getFavoriteProperty(id));
}

// export const addToFavoriteProperty = (params: t.TAddToFavoriteParams) => {
//     return request.post<{ success: true } | { success: false, error: unknown }>(endpoints.createFavoriteProperty(params.url));
// }

export const addToFavoritePropertyByURL = (params: t.TAddToFavoriteParams) => {
    return request.post<{ success: true } | { success: false, error: unknown }>(endpoints.createFavoritePropertyByURL(params.url));
}

export const removeFromFavoriteProperty = (id: string) => {
    return request.delete<{ success: true } | { success: false, error: unknown }>(endpoints.deleteFavoriteProperty(id));
}

export const removeFavoritePropertyByURL = (url: string) => {
    return request.delete<{ success: true } | { success: false, error: unknown }>(endpoints.deleteFavoritePropertiesByUrl(url));
}
