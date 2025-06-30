import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'preguntas/:idExamen',
    renderMode: RenderMode.Server
  },
  {
    path: 'empleado-responder-examen/:idAsignacion',
    renderMode: RenderMode.Server
  },
  {
    path: 'respuestas/:idPregunta',
    renderMode: RenderMode.Server
  },
  {
    path: 'resultados-examen-empleado/:idAsignacion',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
