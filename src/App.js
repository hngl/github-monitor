import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component} from 'react';
import './App.css';
import octokit from '@octokit/rest';
import {Button, Card, CardBody, Col, Container, Form, Input, Label, Row} from 'reactstrap';
import BranchCard from "./BranchCard.js";

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
              {this.state.branches.map(branch => {
                console.debug('Rendering branch', branch);
                return (
                    <Col xs={4} key={branch.name}>
                      <BranchCard branch={branch} client={client} owner={this.state.owner} repo={this.state.repo}/>
                    </Col>
                )
              })}
            </Row>
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

          </Container>
        </div>
    );
  }
}

export default App;
