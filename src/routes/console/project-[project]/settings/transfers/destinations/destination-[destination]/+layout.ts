import { sdkForProject } from '$lib/stores/sdk';
import { Dependencies } from '$lib/constants';
import type { LayoutLoad } from './$types';
import Breadcrumbs from './breadcrumbs.svelte';
import Header from './header.svelte';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ params, parent, depends }) => {
    await parent();
    depends(Dependencies.DESTINATION);

    try {
        return {
            header: Header,
            breadcrumbs: Breadcrumbs,
            destination: await sdkForProject.transfers.getDestination(params.destination)
        };
    } catch (e) {
        throw error(e.code, e.message);
    }
};