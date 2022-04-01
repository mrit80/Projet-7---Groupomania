import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth-context';
import { Link } from 'react-router-dom';
import { useHttpRequest } from '../../hooks/httpRequest-hook';
import { useWindowDimensions } from '../../hooks/window-hook';

// Icones
import clockIcon from '../../images/clock-icon.svg';
import postIcon from '../../images/post-icon.svg';

// Components
import TabBtn from '../../components/Buttons/TabBtn/TabBtn';
import PostList from '../../components/PostList/PostList';
import Spinner from '../../components/LoadingSpinner/LoadingSpinner';

// Styles
import styles from './Posts.module.css';

const Posts = () => {
  // Authentication
  const auth = useContext(AuthContext);

  // Taille de la fenêtre
  const { width } = useWindowDimensions();

  // Requête Hook
  const { isLoading, sendRequest } = useHttpRequest();

  //Posts State
  const [posts, setPosts] = useState();

  // Tab Btn State
  const [activeBtn, setActiveBtn] = useState({
    mostRecents: 'active',
  });

  // Fetch Initial
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/posts`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token,
          }
        );

        setPosts(postsData);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, auth.token]);

  // Fetch Most recent posts
  const fetchMostRecent = async () => {
    setActiveBtn({
      mostRecents: 'active',
    });
    try {
      const postsData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/posts`,
        'GET',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      setPosts(postsData);
    } catch (err) {}
  };

  // Suprimer POST Handler
  const deletePostHandler = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.post_id !== deletedPostId)
    );
  };

  // Afficher le menu post en desktop
  let newPost;

  if (width >= 1024) {
    newPost = (
      <Link to={`posts/new`} className={styles.btn}>
        <span className={styles.text}>NOUVEAU POST</span>
        <img className={styles.icon} src={postIcon} alt="" />
      </Link>
    );
  }

  return (
    <>
      <nav className={styles.header}>
        <TabBtn
          name="Fil d'actualité"
          icon={clockIcon}
          active={activeBtn.mostRecents}
          onClick={fetchMostRecent}
        />

        {newPost}
      </nav>
      <div className="container">
        {isLoading && (
          <div className="spinner">
            <Spinner />
          </div>
        )}
        {!isLoading && activeBtn && posts && (
          <PostList items={posts} onDeletePost={deletePostHandler} />
        )}
      </div>
    </>
  );
};

export default Posts;
