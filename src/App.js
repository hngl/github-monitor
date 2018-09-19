import React, {Component} from 'react';
import './App.css';
import octokit from '@octokit/rest';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import JobGrid from "./JobGrid";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import Dialog from "@material-ui/core/Dialog/Dialog";
import IconButton from "@material-ui/core/IconButton/IconButton";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Slide from "@material-ui/core/Slide/Slide";
import CloseIcon from '@material-ui/icons/Close';

const client = octokit();

const theme = createMuiTheme({palette: {type: 'dark'}});

class App extends Component {

  constructor(props) {
    super(props);

    let token = localStorage.getItem('token');
    this.state = {
      owner: localStorage.getItem('owner'),
      repo: localStorage.getItem('repo'),
      branches: [],
      token: token,
      isSettingsOpen: !token
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
      token: token,
      isSettingsOpen: false
    });
    this.fetchBranches()
  };

  handleOpenSettings = () => {
    this.setState({isSettingsOpen: true})
  };

  handleCloseSettings = () => {
    this.setState({isSettingsOpen: false})
  };

  render() {
    let classes = {};
    return (
        <MuiThemeProvider theme={theme}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
                {this.state.owner} / {this.state.repo}
              </Typography>
              <Button onClick={this.handleOpenSettings}>Settings</Button>
            </Toolbar>
          </AppBar>
          <JobGrid client={client} {...this.state}/>
          <Dialog
              fullScreen
              open={this.state.isSettingsOpen}
              onClose={this.handleCloseSettings}
              TransitionComponent={SlideTransition}
          >
            <form onSubmit={this.handleSettingsSubmit}>
              <AppBar color="default" style={{position: 'relative'}}>
                <Toolbar>
                  <IconButton color="inherit" onClick={this.handleCloseSettings} aria-label="Close">
                    <CloseIcon/>
                  </IconButton>
                  <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
                    Settings
                  </Typography>
                  <Button color="inherit" type="submit">
                    Save
                  </Button>
                </Toolbar>
              </AppBar>
              <List>
                <ListItem>
                  <TextField label="Owner" name="owner" defaultValue={this.state.owner}/>
                </ListItem>
                <ListItem>
                  <TextField label="Repo" name="repo" defaultValue={this.state.repo}/>
                </ListItem>
                <ListItem>
                  <TextField label="Token" name="token" defaultValue={this.state.token}/>
                </ListItem>
              </List>
            </form>
          </Dialog>
        </MuiThemeProvider>
    );
  }
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />;
}

export default App;
