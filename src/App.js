import React, { useEffect, useState } from 'react';
import { firestore } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import badgeCheck from './icons/badge-check.svg';
import hearth from './icons/hearth.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState([]);
  const [tweet, setTweet] = useState({
    tweet: "",
    autor: "",
    user: "",
    timeStamp: new Date()
  });

  useEffect(() => {
    const unsuscribe =
    firestore.collection("tweets")
    .onSnapshot((snapshot) => {
      const tweets = snapshot.docs.map((doc) => {
        return {
          tweet: doc.data().tweet,
          autor: doc.data().autor,
          user: doc.data().autor.toLowerCase(),
          likes: doc.data().likes,
          timeStamp: doc.data().timeStamp,
          id: doc.id
        };
      });
      setMessage(tweets);
    });
    return () => unsuscribe;
  }, []);

  const handleTweet = (e) => {
    let newTweet = {
      ...tweet,
      [e.target.name]: e.target.value
    }
    setTweet(newTweet);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let send = firestore.collection("tweets").add(tweet);
    let getDoc = send.then((docRef) => docRef.get());
    getDoc.then((doc) => {
      let newTweet = {
        tweet: doc.data().tweet,
        autor: doc.data().autor,
        user: doc.data().autor.toLowerCase(),
        id: doc.id
      }
      setMessage([newTweet, ...message]);
    });
    setTweet({
      tweet: "",
      autor: "",
      user: ""
    });
  };

  const deleteTweet = (id) => {
    const newTweets = message.filter((tweet) => tweet.id !== id);
    setMessage(newTweets);
    firestore.doc(`tweets/${id}`).delete();
  }

  const likeTweet = (id, numLikes) => {
    if ( !numLikes ) numLikes = 0;
    firestore.doc(`tweets/${id}`).update({ likes : numLikes + 1 });
  }

  const CapitalizeFirstLetter = (str) => {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str
  }
  
  return (
    <div className="App">
      <div className="sidebar">
        <FontAwesomeIcon className="fa-twitter" icon={faTwitter} />
      </div>
      <p className="sidebar__tweet">Twittar</p>
      <div className="tweetBox">
        <form>
          <div className="tweetbox__input">
            <img
              src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
              alt=""
            />
            <textarea name="tweet" onChange={handleTweet} placeholder="What's happening?" value={tweet.tweet} />
          </div>
            <input className="tweetboxx__input" name="autor" onChange={handleTweet} type="text" placeholder="Author.." value={tweet.autor}></input>
          <button onClick={handleSubmit} className="tweetBox__tweetButton">Send</button>
        </form>
      </div>
      <div className="post_container">
        {message.map((tweet) => {
          return (
            <div className="post" key={tweet.id}>
              <div className="post__avatar">
                <img src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png" alt="" />
              </div>
              <div className="post__body">
                <div className="post__header">
                  <div className="post__headerText">
                    <h3>
                      <p>{CapitalizeFirstLetter(tweet.autor)}<span className="material-icons post__badge"> <img className="badge_style" src={badgeCheck} alt="badge"/></span></p>
                      <span className="post__headerSpecial">{`@${tweet.user}`}</span>
                    </h3>
                  </div>
                  <div className="post__headerDescription">
                    <p>{tweet.tweet}</p>
                  </div>
                </div>
                <button onClick={() => deleteTweet(tweet.id)}>Delete</button>
                <span className="span_img" onClick={() => likeTweet(tweet.id, tweet.likes)}><img height="15px" src={hearth} alt="" /><span>{tweet.likes ? tweet.likes : 0}</span></span>
              </div>
            </div>
          )}
        )}
      </div>
    </div>);
}

export default App;
