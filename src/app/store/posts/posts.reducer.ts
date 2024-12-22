import { createReducer, on } from '@ngrx/store';
import { Post } from '../../models/post.model';
import * as PostsActions from './posts.actions';

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: any;
}

export const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null
};

export const postsReducer = createReducer(
  initialState,
  on(PostsActions.loadPosts, (state): PostsState => ({ ...state, loading: true })),
  on(PostsActions.loadPostsSuccess, (state, { posts }): PostsState => ({ ...state, posts, loading: false })),
  on(PostsActions.loadPostsFailure, (state, { error }): PostsState => ({ ...state, error, loading: false }))
);

