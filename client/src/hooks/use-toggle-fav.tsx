import { QueryKeys } from '@/services/keys';
import { useAddFavoriteProperty, useFavoritePropertiesOptions, useRemoveFavoriteProperty } from '@/services/provider/favProperties';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import * as t from "@/services/types";

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();
    const { data: favorites = [] } = useQuery(useFavoritePropertiesOptions);
    const addFavorite = useAddFavoriteProperty();
    const removeFavorite = useRemoveFavoriteProperty();

    const toggleFavorite = async (url: string) => {
        const isFavorite = favorites.some((fav: t.TFavoriteProperty) => fav.property.property.details_url === url);

        if (isFavorite) {
            await removeFavorite.mutateAsync(url);
        } else {
            await addFavorite.mutateAsync(url);
        }

        // Invalidate and refetch favorites
        queryClient.invalidateQueries({ queryKey: [QueryKeys.favoriteProperties] });
    };

    return { toggleFavorite, favorites };
};
