import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommentsPage } from './comments.page';

const routes: Routes = [
  {
    path: ':postId', // Asegúrate de que la ruta acepte un parámetro
    component: CommentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentsPageRoutingModule {}
