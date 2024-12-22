import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage {
  newPost: Post = {
    title: '',
    content: '',
    detail: '',
    userId: '',
    username: '',
    timestamp: 0
  };

  constructor(
    private postService: PostService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  async addPost() {
    if (this.newPost.title && this.newPost.content) {
      const user = await this.afAuth.currentUser;
      if (user) {
        this.newPost.userId = user.uid;
        this.newPost.username = user.displayName || user.email || 'Usuario anónimo';
        this.newPost.timestamp = Date.now();

        this.postService.addPost(this.newPost).then(() => {
          console.log('Post added successfully');
          this.router.navigate(['/home']);
        }).catch(error => {
          console.error('Error al agregar post:', error);
        });
      } else {
        console.error('Usuario no autenticado');
      }
    } else {
      console.log('Por favor, completa todos los campos requeridos');
    }
  }
}
