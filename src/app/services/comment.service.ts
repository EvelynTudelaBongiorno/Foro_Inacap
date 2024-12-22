import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private firestore: AngularFirestore) {}

  getComments(postId: string): Observable<Comment[]> {
    return this.firestore.collection<Comment>(`posts/${postId}/comments`).valueChanges({ idField: 'id' });
  }

  addComment(postId: string, comment: Comment): Promise<void> {
    return this.firestore.collection(`posts/${postId}/comments`).add(comment).then(() => {
      console.log('Comentario agregado con éxito');
    }).catch((error) => {
      console.error('Error al agregar comentario: ', error);
    });
  }
}
