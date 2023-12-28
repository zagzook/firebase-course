import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db, auth, storage } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([]);

  //new movie states
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newReleaseDate, setNewReleaseDate] = useState(2003);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  //update title states
  const [updatedTitle, setUpdatedTitle] = useState('');

  //upload storage state
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, 'movies');
  const getMovieList = async () => {
    //read the data from DB
    // Set the movie list
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, 'movies', id);
    try {
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, 'movies', id);
    try {
      await updateDoc(movieDoc, { title: updatedTitle });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);

    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        recivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid !== undefined ? auth.currentUser.uid : 'No one logged in',
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='App container  align-items-center'>
      <Auth />
      <hr className='mb-5' />
      <h1>Add Movies</h1>
      <hr className='mb-5' />

      <div className='row g-3 align-items-center'>
        <div className='col'>
          <div className='input-group'>
            <input type='text' className='form-control' placeholder='Movie Title...' onChange={(e) => setNewMovieTitle(e.target.value)} />
          </div>
        </div>

        <div className='col'>
          <div className='input-group'>
            <input type='number' className='form-control' placeholder='Release Date...' onChange={(e) => setNewReleaseDate(e.target.value)} />
          </div>
        </div>
        <div className='col'>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={isNewMovieOscar}
              id='receivedandoscar'
              onChange={(e) => setIsNewMovieOscar(e.target.checked)}
            />
            <label className='form-check-label' htmlFor='receivedandoscar'>
              Received and Oscar?
            </label>
          </div>
        </div>

        <div className='col'>
          <button type='button' className='btn btn-primary' onClick={onSubmitMovie}>
            Submit Movie
          </button>
        </div>
      </div>
      <hr className='mb-5' />
      <h1>List Movies</h1>
      <hr className='mb-5' />
      <div className='mt-5 mb-5'>
        {movieList.map((movie) => (
          <div>
            <div className='row align-items-center'>
              <div className='col-3 align-items-center'>
                <h2 style={{ color: movie.recivedAnOscar ? 'green' : 'red' }}>{movie.title}</h2>
              </div>
              <div className='col-2 align-items-center'>
                <p>Date: {movie.releaseDate}</p>
              </div>
              <div className='col-2 align-items-center'>
                <p>Created by: {movie.userId}</p>
              </div>
              <div className='col-2 align-items-center'>
                <button className='btn btn-warning' onClick={() => deleteMovie(movie.id)}>
                  Delete Movie
                </button>
              </div>
              <div className='col align-items-center input-group'>
                <input className='form-control' onChange={(e) => setUpdatedTitle(e.target.value)} />
                <button className='btn btn-success' onClick={() => updateMovieTitle(movie.id)}>
                  Update Movie Title
                </button>
              </div>
            </div>
            <hr className='mb-5' />
          </div>
        ))}
      </div>
      <div className='row align-items-center mb-5'>
        <div className='col align-items-center input-group'>
          <input type='file' className='form-control' onChange={(e) => setFileUpload(e.target.files[0])} />
          <button className='btn btn-success' onClick={uploadFile}>
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
