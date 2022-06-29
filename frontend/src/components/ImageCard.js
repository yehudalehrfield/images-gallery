import React from 'react';
import {
  Card,
  Button,
  Nav,
  Tooltip,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/index.css';

const ImageCard = ({ image, deleteImage, saveImage }) => {
  const authorName = image.user?.name || 'Unknown Author';
  const authorPortfolioURL = image.user?.portfolio_url;

  // const popover = (
  //   <Popover id="popover-basic">
  //     <Popover.Header as="h3">Popover right</Popover.Header>
  //     <Popover.Body>
  //       And here's some <strong>amazing</strong> content. It's very engaging.
  //       right?
  //     </Popover.Body>
  //   </Popover>
  // );

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={image.urls.small} />
      <Card.Body>
        {/* add title and description beneath image */}
        <Card.Title>{image.title?.toUpperCase()}</Card.Title>
        <Card.Text>{image.description || image.alt_description}</Card.Text>
        {/* add button for delete and save (when applicable) */}
        <Button variant="primary" onClick={() => deleteImage(image.id)}>
          Delete
        </Button>{' '}
        {!image.saved && (
          <Button variant="secondary" onClick={() => saveImage(image.id)}>
            Save
          </Button>
        )}{' '}
        <OverlayTrigger
          placement="right"
          overlay={
            // How do i change the color of the tooltip?
            <Tooltip className="my-tooltip">
              Search Date: {image.date_retrieved} <br></br>
              Photo Date: {image.created_at.slice(0, 10)} <br></br>
              Downloads: {image.downloads} <br></br>
              Views: {image.views}
            </Tooltip>
          }
        >
          <Button variant="info">Image Info</Button>
        </OverlayTrigger>
        {/* This does not work --> opens a new, blank page */}
        {/* <OverlayTrigger trigger="click" placement="right" overlay={popover}>
          <Button variant="info">Click me to see</Button>
        </OverlayTrigger> */}
      </Card.Body>
      {/* Add author name (if known) and link to portfolio (if applicable) */}
      {/* Bogdon Version: */}
      <Card.Footer className="text-center text-muted">
        {authorPortfolioURL && (
          <Nav.Link href={authorPortfolioURL} target="_blank">
            {authorName}
          </Nav.Link>
        )}
        {!authorPortfolioURL && authorName}
      </Card.Footer>
      {/* My Version:
      <Card.Footer className="text-center text-muted">
        {image.user.portfolio_url ? (
          <Nav.Link href={image.user.portfolio_url} target="_blank">
            {image.user.name != null ? image.user.name : 'Author Unknown'}
          </Nav.Link>
        ) : (
          image.user?.name || 'Author Unknown'
        )}
      </Card.Footer> */}
    </Card>
  );
};

export default ImageCard;
