export const image500 = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w500/${path}` : null;
export const image342 = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w342/${path}` : null;
export const image185 = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w185/${path}` : null;

// fallback images
export const fallbackMoviePoster =
  'https://img.myloview.com/stickers/white-laptop-screen-with-hd-video-technology-icon-isolated-on-grey-background-abstract-circle-random-dots-vector-illustration-400-176057922.jpg';
export const fallbackPersonImage =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmUiF-YGjavA63_Au8jQj7zxnFxS_Ay9xc6pxleMqCxH92SzeNSjBTwZ0l61E4B3KTS7o&usqp=CAU';
