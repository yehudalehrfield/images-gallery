import React from 'react';
import { Card, Button, Nav } from 'react-bootstrap';

const ImageCard = ({ image, deleteImage, saveImage }) => {
  const authorName = image.user?.name || 'Unknown Author';
  const authorPortfolioURL = image.user?.portfolio_url;

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={image.urls.small} />
      <Card.Body>
        <Card.Title>{image.title?.toUpperCase()}</Card.Title>
        <Card.Text>{image.description || image.alt_description}</Card.Text>
        <Button variant="primary" onClick={() => deleteImage(image.id)}>
          Delete
        </Button>{' '}
        {!image.saved && (
          <Button variant="secondary" onClick={() => saveImage(image.id)}>
            Save
          </Button>
        )}
      </Card.Body>
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
