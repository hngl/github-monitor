import React, {Component} from 'react';
import './App.css';
import octokit from '@octokit/rest';
import {Card, CardBody, CardText, CardTitle, Col, Container, Form, Input, Label, Row, Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const client = octokit();

class App extends Component {

  constructor() {
    super();
    this.state = {
      owner: localStorage.getItem('owner'),
      repo: localStorage.getItem('repo'),
      branches: [],
      token: localStorage.getItem('token')
    };
    if(this.state.token) {
      this.fetchBranches()
    }
  }

  fetchBranches = () => {
    client.authenticate({type: 'token', token: this.state.token});
    client.repos.getBranches({
      owner: this.state.owner,
      repo: this.state.repo
    }).then(({data}) => {
      this.setState({branches: data});
    })
  };

  handleSettingsSubmit = (event) => {
    event.preventDefault();
    console.debug(event.target);
    let owner = event.target.elements.owner.value;
    let repo = event.target.elements.repo.value;
    let token = event.target.elements.token.value;
    localStorage.setItem('owner', owner);
    localStorage.setItem('repo', repo);
    localStorage.setItem('token', token);
    this.setState({
      owner: owner,
      repo: repo,
      token: token
    });
    this.fetchBranches()
  };

  render() {
    return (
        <div>
          <Container fluid={true}>
            <Row>
              <Col>
                <Card className="settings">
                  <CardBody>
                      <Form onSubmit={this.handleSettingsSubmit}>
                        <Label>Owner</Label>
                        <Input name="owner" defaultValue={this.state.owner}/>
                        <Label>Repo</Label>
                        <Input name="repo" defaultValue={this.state.repo}/>
                        <Label>Token</Label>
                        <Input name="token" defaultValue={this.state.token}/>
                        <Button>Save</Button>
                      </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              {this.state.branches.map(branch => {
                return (
                    <Col xs={4} key={branch.name}>
                      <Card>
                        <CardBody>
                          <CardTitle>
                            {branch.name}
                          </CardTitle>
                          <CardText>
                            {branch.commit.sha.substring(0, 6)}
                          </CardText>
                        </CardBody>
                      </Card>
                    </Col>
                )
              })}
            </Row>
          </Container>
        </div>
    );
  }
}

export default App;
