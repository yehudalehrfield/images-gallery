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
  // React hooks to reset state(s)
  const [word, setWord] = useState(''); //search word, initialize empty string
  const [images, setImages] = useState([]); //new image and image array, initialize empty array
  const [loading, setLoading] = useState(true); //state of loading images from database, initialize true

  // Function to load images from the database
  const getSavedImages = async (sortType) => {
    // let sortType = 'user.name';
    try {
      const res = await axios.get(`${API_URL}/images?sorting=${sortType}`); //get images from db
      setImages(res.data || []); //set the images array with images from db or empty array
      setLoading(false); //after loading images, set false (finished loading)
      toast.success('Saved images loaded from the database'); // toast notification for loaded images
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // call useEffect which calls getSavedImages;
  // second argument is the dependancy, such that this is only called once (when App renders)
  useEffect(() => getSavedImages('title'), []);

  // helper function to search for images
  const handleSearchSubmit = async (e) => {
    e.preventDefault(); // preventing action from happening before submit button is clicked
    try {
      const res = await axios.get(`${API_URL}/new-image?query=${word}`); //get new image from UnSplash using word
      // console.log('adding found image to the state');
      setImages([{ ...res.data, title: word }, ...images]); //update the images array (add to front)
      // console.log(res.data);
      toast.info(`New Image ${word.toUpperCase()} was found`); //toast notification after image was found
    } catch (error) {
      console.log(error);
      toast.error(error.log);
    }

    // console.log('clearing search form');
    setWord('');
  };

  // helper function to delete an image
  // called when "save" is clicked on
  // There is an error when trying to delete an image that is not saved to the db
  const handleDeleteImage = async (id) => {
    try {
      const imageToBeDeleted = images.find((image) => image.id === id); // locate image to delete
      // using try-catch for images that are not saved to the db -> bypass the 404 error
      try {
        const res = await axios.delete(`${API_URL}/images/${id}`); // delete from the db
        if (res.data?.deleted_id) {
          toast.warn(
            `Image ${imageToBeDeleted.title.toUpperCase()} was deleted from the database`
          );
        }
      } catch {
        toast.warn(`Image ${imageToBeDeleted.title.toUpperCase()} was deleted`);
      }
      // // Bogdan version:
      // toast.warn(
      //   `Image ${images
      //     .find((i) => i.id === id)
      //     .title.toUpperCase()} was deleted`
      // );
      setImages(images.filter((image) => image.id !== id)); // update images array by filtering out the image to be deleted
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // helper function to save an image
  // called when "save" is clicked on
  const handleSaveImage = async (id) => {
    const imageToBeSaved = images.find((image) => image.id === id); //locate the image in the images array
    imageToBeSaved.saved = true; // set the image as saved (?)
    try {
      const res = await axios.post(`${API_URL}/images`, imageToBeSaved); // post the image to the db
      if (res.data?.inserted_id) {
        // setting the image as saved (?)
        setImages(
          images.map((image) =>
            image.id === id ? { ...image, saved: true } : image
          )
        );
        //toast notification after successful post
        toast.success(
          `Image ${imageToBeSaved.title.toUpperCase()} was saved to the database`
        );
      }
      // console.log(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // frontend UI displays images or welcome
  return (
    <div>
      <Header title="Images Gallery" />
      {loading ? ( //if loading (i.e. page is refreshed), show spinner
        <Spinner />
      ) : (
        //else show either search bar with images or welcome
        <>
          <Search
            //props -> word, setWord (fct), handleSearchSubmit (fct)
            word={word}
            setWord={setWord}
            handleSubmit={handleSearchSubmit}
            loadImages={getSavedImages}
          />
          <Container className="mt-4">
            {images.length ? ( // if images array isn't empty, show images in cards
              // three cards for large screen, two for medium, one for small
              <Row xs={1} md={2} lg={3}>
                {images.map((image, i) => (
                  <Col key={i} className="pb-3">
                    <ImageCard
                      image={image} // for image, title, description, author and portfolio
                      deleteImage={handleDeleteImage} // for delete button
                      saveImage={handleSaveImage} // for save button
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
