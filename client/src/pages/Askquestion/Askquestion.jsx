import React, { useState } from 'react';
import './Askquestion.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { askquestion } from '../../action/question';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const Askquestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentuserreducer);

  const [questiontitle, setquestiontitle] = useState('');
  const [questionbody, setquestionbody] = useState('');
  const [questiontag, setquestiontags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleEnter = (e) => {
    if (e.code === 'Enter') {
      setquestionbody(questionbody + '\n');
    }
  };

  const isTimeRestricted = () => {
    const currentHour = new Date().getHours();
    return currentHour < 14 || currentHour > 19; // only allowed between 2 PM–7 PM
  };

  const validateVideo = (file) => {
    if (!file) return true;
    const maxSizeMB = 50;
    const maxDurationSeconds = 120;

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert('Video size should not exceed 50MB.');
      return false;
    }

    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > maxDurationSeconds) {
          alert('Video duration should not exceed 2 minutes.');
          resolve(false);
        } else {
          resolve(true);
        }
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const uploadVideo = async (file) => {
    return new Promise((resolve, reject) => {
      const fileRef = ref(storage, `videos/${file.name}_${Date.now()}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert('Login to ask question');
    if (!questionbody || !questiontitle || !questiontag)
      return alert('Please enter all the fields');

    if (isTimeRestricted()) {
      return alert('Video uploads allowed only between 2 PM and 7 PM');
    }

    const isVideoValid = await validateVideo(videoFile);
    if (!isVideoValid) return;

    let videoURL = '';
    if (videoFile) {
      try {
        videoURL = await uploadVideo(videoFile);
      } catch (err) {
        console.error(err);
        return alert('Failed to upload video');
      }
    }

    dispatch(
      askquestion(
        {
          questiontitle,
          questionbody,
          questiontag,
          userposted: user.result.name,
          video: videoURL,
        },
        navigate
      )
    );

    alert('You have successfully posted a question');
  };

  return (
    <div className="ask-question">
      <div className="ask-ques-container">
        <h1>Ask a public Question</h1>
        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>Title</h4>
              <p>Your question to another person</p>
              <input
                type="text"
                id="ask-ques-title"
                onChange={(e) => setquestiontitle(e.target.value)}
                placeholder="e.g. How does version control (like Git) work, and why is it important? "
              />
            </label>

            <label htmlFor="ask-ques-body">
              <h4>Body</h4>
              <p>Ask your question to make someone to answer</p>
              <textarea
                id="ask-ques-body"
                onChange={(e) => setquestionbody(e.target.value)}
                onKeyDown={handleEnter}
                rows="10"
              ></textarea>
            </label>

            <label htmlFor="ask-ques-tags">
              <h4>Tags</h4>
              <p>Add up to 5 tags to describe what your question is about</p>
              <input
                type="text"
                id="ask-ques-tags"
                onChange={(e) => setquestiontags(e.target.value.split(' '))}
                placeholder="e.g. (xml typescript wordpress)"
              />
            </label>

            <label htmlFor="ask-ques-video">
              <h4>Attach Video </h4>
              <p>Max size: 50MB, Max duration: 2 minutes. Upload allowed only from 2 PM–7 PM.</p>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
              {uploadProgress > 0 && (
                <p>Uploading: {uploadProgress}%</p>
              )}
            </label>
          </div>

          <input type="submit" value="Review your question" className="review-btn" />
        </form>
      </div>
    </div>
  );
};

export default Askquestion;
