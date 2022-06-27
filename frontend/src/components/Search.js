import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

// Function to search for an image based on specific search word(s)
const Search = ({ word, setWord, handleSubmit }) => {
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Row>
              <Col xs={9}>
                <Form.Control
                  type="text" // for search word
                  value={word} // for search word
                  onChange={(e) => setWord(e.target.value)} //update with every change in word
                  placeholder="Search for new image..." //when no text is entered yet
                />
              </Col>
              <Col>
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
