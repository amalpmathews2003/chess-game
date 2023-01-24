import type { PageLoad } from './$types';
export const load = (({ params }) => {
  return {
    room: {
      id: params.roomId
    }
  };
}) satisfies PageLoad;