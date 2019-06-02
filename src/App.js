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
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

const client = octokit();

const theme = createMuiTheme({palette: {type: 'dark'}});

class App extends Component {

  constructor(props) {
    super(props);

    let token = localStorage.getItem('token');
    this.state = {
      owner: localStorage.getItem('owner'),
      repo: localStorage.getItem('repo'),
      token: token,
      isSettingsOpen: false
    };

    // If token found, authenticate already
    if(token) {
      client.authenticate({type: 'token', token: token});
    }
  }

  handleSettingsSubmit = (event) => {
    event.preventDefault();
    let owner = event.target.elements.owner.value;
    let repo = event.target.elements.repo.value;
    let token = event.target.elements.token.value;
    // If token changed, re-authenticate
    if(token !== this.state.token) {
        client.authenticate({type: 'token', token: token});
    }
    // Store new values
    localStorage.setItem('owner', owner);
    localStorage.setItem('repo', repo);
    localStorage.setItem('token', token);
    this.setState({
      owner: owner,
      repo: repo,
      token: token,
      isSettingsOpen: false
    });
  };

  handleOpenSettings = () => {
    this.setState({isSettingsOpen: true})
  };

  handleCloseSettings = () => {
    this.setState({isSettingsOpen: false})
  };

  isConfigured = () => {
    return this.state.owner && this.state.repo
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
              {this.isConfigured() ? (
                  this.state.owner + '/' +  this.state.repo
              ) : (
                <span>Github Monitor <small>by hngl</small></span>
              ) }
            </Typography>
            <Button onClick={this.handleOpenSettings}>Settings</Button>
          </Toolbar>
        </AppBar>
        <div className='app-contents'>
          {this.isConfigured() ? (
              <JobGrid client={client} {...this.state}/>
          ) : (
              <GoToSettingsCard
                  message="No repository configured yet. We're just getting started."
                  onClick={this.handleOpenSettings}
              />
          ) }
        </div>
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
                <TextField label="Repository" name="repo" defaultValue={this.state.repo}/>
              </ListItem>
              <ListItem>
                <TextField label="Personal Access Token" name="token" defaultValue={this.state.token} helperText={this.renderTokenHelperText()} />
              </ListItem>
            </List>
          </form>
        </Dialog>
      </MuiThemeProvider>
    );
  }

  renderTokenHelperText = () => {
    return (
      <span>
        Go get a token at&nbsp;
        <a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank">
          Github Settings
        </a>
      </span>
    );
  }
}

function GoToSettingsCard(props) {
  return (
      <Card className='notice-card'>
        <CardContent>
          <Typography variant="body2" component="p">
            {props.message}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={props.onClick}>Go to Settings</Button>
        </CardActions>
      </Card>
  );
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />;
}

export default App;
