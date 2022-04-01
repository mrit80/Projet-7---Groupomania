import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpRequest } from '../../hooks/httpRequest-hook';
import { useForm } from '../../hooks/form-hook';
import { AuthContext } from '../../context/auth-context';
import { MinLength, MaxLength } from '../../utils/validators';

// Icones
import send from '../../images/send-icon.svg';

// Components
import Post from '../../components/Post/Post';
import Comment from '../../components/Comment/Comment';
import InputField from '../../components/InputField/InputField';
import Spinner from '../../components/LoadingSpinner/LoadingSpinner';

// Styles
import styles from './CommentPost.module.css';

const CommentPost = () => {
  // Authentication
  const auth = useContext(AuthContext);

  // Publication ID
  const postId = useParams().id;

  // Requête Backend Hook
  const { isLoading, sendRequest } = useHttpRequest();

  // Publication Hook
  const [post, setPost] = useState();

  // Réponse Hook
  const [comments, setComments] = useState();

  // Form useState
  const [formState, inputHandler] = useForm(
    {
      comment: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  // Requête Fetch du Post dans le Backend
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await sendRequest(
          `${process.env.REACT_APP_API_URL}/posts/${postId}`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token,
          }
        );
        setPost(post[0]);
        setComments(post[1].comments);
      } catch (err) {}
    };
    fetchPost();
  }, [sendRequest, setPost, auth.token, postId, setComments]);

  // Gérer la réponse
  const postCommentHandler = async (event) => {
    event.preventDefault();

    if (!formState.isValid) {
      return;
    }

    try {
      // si valide stock la réponse ( commentaire ) dans newCommentData
      const newCommentData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/posts/comment`,
        'POST',
        JSON.stringify({
          postId: postId,
          message: formState.inputs.comment.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      setComments((prevComments) => [...prevComments, newCommentData[0]]);
      inputHandler('comment', '', false); // Réintialise inputHandler pour les prochaines réponses
    } catch (err) {}
  };

  // Supprimer Publication
  const deletePostHandler = (deletedPostId) => {
    setPost((prevPosts) =>
      prevPosts.filter((post) => post.post_id !== deletedPostId)
    );
  };

  // Supprimer une réponse
  const deleteCommentHandler = (deletedCommentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== deletedCommentId)
    );
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className="spinner">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <div className={styles.container}>
          <h2>Pas d'informations</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
        {!isLoading && post && comments && (
          <div className={styles.wrapper}>
            <Post
              key={post.post_id}
              id={post.post_id}
              user_id={post.user_id}
              photo_url={post.photo_url}
              firstName={post.firstName}
              lastName={post.lastName}
              date={post.post_date}
              title={post.title}
              image_url={post.image_url}
              comments={post.commentsCounter}
              userReaction={post.userReaction}
              post_link={`/posts/${post.post_id}`}
              onDelete={deletePostHandler}
            />
            <section>
              {comments.map((comment, index) => {
                return (
                  <Comment
                    key={index}
                    id={comment.id}
                    user_id={comment.user_id}
                    photo_url={comment.photo_url}
                    firstName={comment.firstName}
                    lastName={comment.lastName}
                    date={comment.comment_date}
                    message={comment.message}
                    onDeleteComment={deleteCommentHandler}
                  />
                );
              })}
            </section>
            <div className={styles.comment_wrap}>
              <form
                className={styles.comment_form}
                id="comment-form"
                onSubmit={postCommentHandler}
              >
                <InputField
                  id="comment"
                  className={styles.box}
                  name="comment"
                  type="text"
                  placeholder="Écrivez un commentaire"
                  maxLength="65"
                  element="textarea"
                  hasLabel="yes"
                  textIsWhite="no"
                  validators={[MinLength(2), MaxLength(65)]}
                  errorText="Veillez écrire un commentaire"
                  onInput={inputHandler}
                  initialValue=""
                  initialValid={false}
                />
              </form>
              <button form="comment-form" className={styles.btn} type="submit">
                <img className={styles.icon} src={send} alt="Publier réponse" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CommentPost;
