import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesComponent } from './notes/notes.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth-guard.service';
import { PublicComponent } from './public/public.component';

const appRoutes: Routes = [
  { path: '', component: NotesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
