import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';  // Importamos Post desde el modelo

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private firestore: AngularFirestore) {}

  getPosts(): Observable<Post[]> {
    return this.firestore.collection<Post>('posts').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        return { ...data, id };
      }))
    );
  }
  getPost(id: string): Observable<Post | null> {
    return this.firestore.doc<Post>(`posts/${id}`).valueChanges().pipe(
      map(post => post ? { ...post, id } : null)
    );
  }
  addPost(post: Post): Promise<void> {
    return this.firestore.collection('posts').add(post).then(() => {
      console.log('Post added successfully');
    }).catch((error) => {
      console.error('Error adding post: ', error);
    });
  }

  updatePost(id: string, post: Partial<Post>) {
    return this.firestore.doc(`posts/${id}`).update(post);
  }

  deletePost(id: string) {
    return this.firestore.doc(`posts/${id}`).delete();
  }
}
