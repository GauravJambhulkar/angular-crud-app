import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // The wildcard route previously used prerendering, which triggered a build
  // error because parameterized routes (like `edit/:id`) require a
  // `getPrerenderParams` implementation.  For this small demo we don't need
  // prerendering, so switch to server rendering instead which avoids the
  // issue entirely.
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
