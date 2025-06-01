import { UseQueryOptions, useQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys, MutationKeys } from "../keys";
import * as dataService from "@/services";
import { toast } from "sonner";

export const useFavoritePropertiesQuery = () => {
    return useQuery(useFavoritePropertiesOptions);
};

export const useFavoritePropertiesOptions = queryOptions({
    queryKey: [QueryKeys.favoriteProperties],
    queryFn: () => dataService.getFavoriteProperties(),
});

export const useFavoritePropertiesByUrl = (url: string) => {
    return useQuery(useFavoritePropertyOptions(url));
};

export const useFavoritePropertyOptions = (url: string) => queryOptions({
    queryKey: [QueryKeys.favoriteProperty, url],
    queryFn: () => dataService.getFavoritePropertyByUrl(url),
    retry: 1
});

export const useRemoveFavoriteProperty = () =>  {
    return useMutation({
    mutationKey: [MutationKeys.removeFavoriteProperty],
    mutationFn: (id: string) => dataService.removeFromFavoriteProperty(id),
})}

export const useAddFavoritePropertyByURL = (url: string) =>  {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: [MutationKeys.createFavoritePropertyByURL, url],
        mutationFn: (url: string) => dataService.addToFavoritePropertyByURL({ url }),  
        onMutate: async (url) => {
            // prevent further queries
            queryClient.cancelQueries({ queryKey: [QueryKeys.favoriteProperty, url]})

            // store prev values
            const prev = queryClient.getQueryData([QueryKeys.favoriteProperty, url])

            // update cache
            queryClient.setQueryData([QueryKeys.favoriteProperty, url], () => ({
                property: {
                    details_url: url
                }
            }))
            
            // store in context by returning
            return { prev, url }
        },
        onSuccess: () => {
            toast.success("Added property to favourites.")
        },
        onError: async (e,__,context) => {
            await queryClient.setQueryData([QueryKeys.favoriteProperty, context.url], context.prev ?? {})
            toast.error(`Failed to add property with url (${context.url}) to favourites.`)
            console.log('Failed to add property: ', e)
        },
          // Always refetch after error or success:
        onSettled: (_,__,___,context) => queryClient.invalidateQueries({ queryKey: [QueryKeys.favoriteProperty, context.url] }),
    })
}

export const useRemoveFavoritePropertyByURL = (url: string) =>  {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: [MutationKeys.removeFavoritePropertyByURL, url],
        mutationFn: (url: string) => dataService.removeFavoritePropertyByURL(url),  
        onMutate: async (url) => {
            // prevent further queries
            queryClient.cancelQueries({ queryKey: [QueryKeys.favoriteProperty, url]})

            // store prev values
            const prev = queryClient.getQueryData([QueryKeys.favoriteProperty, url])

            // update cache
            queryClient.setQueryData([QueryKeys.favoriteProperty, url], () => ({
                property: {
                    details_url: null
                }
            }))
            
            // store in context by returning
            return { prev, url }
        },
        onSuccess: () => {
            toast.success("Remove property from favourites.")
        },
        onError: async (e,__,context) => {
            await queryClient.setQueryData([QueryKeys.favoriteProperty, context.url], context.prev ?? {})
            toast.error(`Failed to remove property with url (${context.url}) from favourites.`)
            console.log('Failed to remove property',e)
        },
          // Always refetch after error or success:
        onSettled: (_,__,___,context) => queryClient.invalidateQueries({ queryKey: [QueryKeys.favoriteProperty, context.url] }),
})}
