import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../services/comment.service';
import { Comment } from '../models/comment.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  comments: Comment[] = [];
  newCommentText: string = '';
  postId: string = ''; // Inicializar con un valor por defecto

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.postId = params.get('postId') || '';
      this.loadComments();
    });
  }

  loadComments() {
    if (this.postId) {
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
  }

  async addComment() {
    if (this.newCommentText.trim() === '') {
      console.log('El comentario no puede estar vacío');
      return;
    }

    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    console.log('Usuario actual:', user.uid); // Log para verificar el usuario actual

    const comment: Comment = {
      userId: user.uid,
      username: user.displayName || user.email || 'Usuario anónimo',
      profilePicture: user.photoURL || 'assets/default-avatar.png',
      text: this.newCommentText,
      timestamp: Date.now(),
      upvotes: 0,
      downvotes: 0
    };
    
    this.commentService.addComment(this.postId, comment).then(() => {
      console.log('Comentario agregado con éxito');
      this.newCommentText = '';
      this.loadComments();
    }).catch(error => {
      console.error('Error al agregar comentario:', error);
    });
  }
}
