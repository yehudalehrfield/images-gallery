import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Search from './components/Search';
import ImageCard from './components/ImageCard';
import Welcome from './components/Welcome';
import Spinner from './components/Spinner';
import { Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //do we need this?

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5050';

const App = () => {
  const [word, setWord] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSavedImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/images`);
      setImages(res.data || []);
      setLoading(false);
      toast.success('Saved images successfully loaded from the database');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // call useEffect which calls getSavedImages;
  // second argument is the dependancy such that this is only called once (when App renders)
  useEffect(() => getSavedImages(), []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}/new-image?query=${word}`);
      // console.log('ading found image to the state');
      setImages([{ ...res.data, title: word }, ...images]);
      // console.log(res.data);
      toast.info(`New Image ${word.toUpperCase()} was found`);
    } catch (error) {
      console.log(error);
      toast.error(error.log);
    }

    // console.log('clearing search form');
    setWord('');
  };

  const handleDeleteImage = async (id) => {
    const imageToBeDeleted = images.find((image) => image.id === id);
    // const res = await axios.delete()
    setImages(images.filter((image) => image.id !== id));
    const res = await axios.delete(`${API_URL}/images/${id}`);
    if (res.data?.deleted_id) {
      // how to fix the issue that the image is not deleted if not yet saved to the db...?
      toast.warn(
        `Image ${imageToBeDeleted.title.toUpperCase()} was deleted from the database`
      );
    }
    try {
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSaveImage = async (id) => {
    const imageToBeSaved = images.find((image) => image.id === id);
    imageToBeSaved.saved = true;
    try {
      const res = await axios.post(`${API_URL}/images`, imageToBeSaved);
      if (res.data?.inserted_id) {
        setImages(
          images.map((image) =>
            image.id === id ? { ...image, saved: true } : image
          )
        );
        toast.success(
          `Image ${imageToBeSaved.title.toUpperCase()} was successfuly saved to the database`
        );
      }
      console.log(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Header title="Images Gallery" />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Search
            word={word}
            setWord={setWord}
            handleSubmit={handleSearchSubmit}
          />
          <Container className="mt-4">
            {images.length ? (
              <Row xs={1} md={2} lg={3}>
                {images.map((image, i) => (
                  <Col key={i} className="pb-3">
                    <ImageCard
                      image={image}
                      deleteImage={handleDeleteImage}
                      saveImage={handleSaveImage}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Welcome />
            )}
          </Container>{' '}
        </>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        newestOnTop={true}
      />
      ;
    </div>
  );
};

export default App;
