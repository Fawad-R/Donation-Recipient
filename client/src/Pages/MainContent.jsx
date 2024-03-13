// Content.js
import React from 'react';

// import WeeklySales from './WeeklySales';
import { Row, Col, Card } from 'react-bootstrap';

const MainContent = () => {
    return (
        <main role="main" className="col-md-9 ml-sm-auto col-lg-9 px-4">
            <Row className="g-3 mb-3">
                <Col md={6} xxl={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                This is some demo text content for your card. You can replace this with your own content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xxl={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                This is some demo text content for your card. You can replace this with your own content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="g-3 mb-3">
                <Col md={6} xxl={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                This is some demo text content for your card. You can replace this with your own content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xxl={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                This is some demo text content for your card. You can replace this with your own content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </main>
    );
};

export default MainContent;
