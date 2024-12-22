import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {
  post: Post | null = null;
  comments: Comment[] = [];
  newCommentText: string = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(postId);
      this.loadComments(postId);
    }
  }

  loadPost(postId: string) {
    this.postService.getPost(postId).subscribe(
      (post: Post | null) => {
        this.post = post;
      },
      error => {
        console.error('Error al cargar el post:', error);
      }
    );
  }

  loadComments(postId: string) {
    this.commentService.getComments(postId).subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
      },
      error => {
        console.error('Error al cargar comentarios:', error);
      }
    );
  }

  async addComment() {
    if (this.post && this.newCommentText.trim() !== '') {
      const user = await this.afAuth.currentUser;
      if (user) {
        const comment: Comment = {
          userId: user.uid,
          username: user.displayName || user.email || 'Usuario anónimo',
          profilePicture: user.photoURL || 'assets/default-avatar.png',
          text: this.newCommentText,
          timestamp: Date.now(),
          upvotes: 0,
          downvotes: 0
        };
        
        this.commentService.addComment(this.post.id || '', comment).then(() => {
          this.newCommentText = '';
          this.loadComments(this.post?.id || '');
        }).catch(error => {
          console.error('Error al agregar comentario:', error);
        });
      } else {
        console.error('Usuario no autenticado');
      }
    }
  }
}
