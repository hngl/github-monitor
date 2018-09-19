import React, {Component} from 'react';
import './App.css';
import octokit from '@octokit/rest';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import JobGrid from "./JobGrid";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const client = octokit();

const theme = createMuiTheme({palette: {type: 'dark'}});

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
        <MuiThemeProvider theme={theme}>
          <Container fluid={true}>
            <JobGrid client={client} {...this.state}/>
            <Row>
              <Col>
                <Card className="settings">
                    <form onSubmit={this.handleSettingsSubmit}>
                      <TextField label="Owner" name="owner" defaultValue={this.state.owner}/>
                      <TextField label="Repo" name="repo" defaultValue={this.state.repo}/>
                      <TextField label="Token" name="token" defaultValue={this.state.token}/>
                      <Button>Save</Button>
                    </form>
                </Card>
              </Col>
            </Row>
          </Container>
        </MuiThemeProvider>
    );
  }
}

function Col(props) {
  return(<div>{props.children}</div>);
}

function Row(props) {
  return(<div>{props.children}</div>);
}

function Container(props) {
  return(<div>{props.children}</div>);
}




export default App;
