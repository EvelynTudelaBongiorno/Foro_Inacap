import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment.prod';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { IonicStorageModule } from '@ionic/storage-angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { postsReducer } from './store/posts/posts.reducer';
import { PostsEffects } from './store/posts/posts.effects';
import { CommentsPageModule } from './comments/comments.module';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

/**
 * AppModule es el módulo raíz de la aplicación.
 * Inicializa el AppComponent y importa los módulos necesarios.
 */
@NgModule({
  declarations: [
    /**
     * AppComponent se declara como parte de este módulo.
     */
    AppComponent
  ],
  imports: [
    /*BrowserModule es necesario para ejecutar la aplicación en un navegador*/
    BrowserModule,
    /* IonicModule se inicializa con la configuración predeterminada.*/
    IonicModule.forRoot(),
    /*AppRoutingModule maneja la configuración de enrutamiento.*/
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.FIREBASE_CONFIG), // Asegúrate de inicializar Firebase
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot(),
    StoreModule.forRoot({ posts: postsReducer }),
    EffectsModule.forRoot([PostsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    CommentsPageModule,
    AngularFirestoreModule
  ],
  providers: [
    /*RouteReuseStrategy se proporciona para manejar la estrategia de reutilización de rutas.*/
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [
    /*AppComponent se inicializa para lanzar la aplicación.*/
    AppComponent
  ],
})
export class AppModule {}
