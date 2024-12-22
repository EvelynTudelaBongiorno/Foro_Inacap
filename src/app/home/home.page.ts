import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';  // Importamos Post desde el modelo
import { CommentService } from '../services/comment.service';
import { Comment } from '../models/comment.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  posts: Post[] = [];
  postId = '';
  comments: Comment[] = [];
  newPostContent: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('postId') || '';
    this.loadPosts();
    this.loadComments();
  }

  loadPosts() {
    this.postService.getPosts().subscribe(
      (posts: Post[]) => {
        console.log('Posts cargados:', posts);
        this.posts = posts;
      },
      error => {
        console.error('Error al cargar posts:', error);
      }
    );
  }

  loadComments() {
    this.commentService.getComments(this.postId).subscribe(
      (comments: Comment[]) => {
        console.log('Comentarios cargados:', comments);
        this.comments = comments;
      },
      error => {
        console.error('Error al cargar comentarios:', error);
      }
    );
  }

  async logout() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  goToPostDetails(postId: string | undefined) {
    if (postId) {
      this.router.navigate(['/post-details', postId]);
    } else {
      console.error('ID de post no válido');
    }
  }

  async addPost() {
    if (this.newPostContent.trim() !== '') {
      const user = await this.afAuth.currentUser;
      if (user) {
        const newPost: Post = {
          title: 'Nuevo Post', // Puedes ajustar esto según tus necesidades
          content: this.newPostContent,
          detail: '',
          userId: user.uid,
          username: user.displayName || user.email || 'Usuario anónimo',
          timestamp: Date.now()
        };
        this.postService.addPost(newPost).then(() => {
          console.log('Post agregado con éxito');
          this.newPostContent = ''; // Limpiar el campo de entrada
          this.loadPosts(); // Recargar los posts
        }).catch(error => {
          console.error('Error al agregar post:', error);
        });
      } else {
        console.error('Usuario no autenticado');
      }
    }
  }
}
