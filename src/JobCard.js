import React, {Component} from "react";
import Card from "@material-ui/core/Card";
import './JobCard.css'
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import moment from 'moment';

function shortSha(sha) {
  return sha.substring(0, 6)
}

export default class JobCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branch: props.branch,
    };
    this.client = props.client;
    this.fetchStatus();
    this.fetchCommitDetails();
  }

  render() {
    let commit = '';
    if(undefined === this.state.message){
      commit = shortSha(this.state.branch.commit.sha)
    } else {
      commit = this.state.author.name + ': '+ this.state.message;
    }

    return (
        <Card className={"job-card " + this.state.status}>
          <CardContent>
            <Typography variant={"headline"} component="h2" className="job-name">
              {this.state.branch.name}
            </Typography>
            <Typography variant={"subheading"} component="h3" className="commit-desc">
              {commit}
            </Typography>
            <Typography component="p" className="commit-desc">
              {this.state.author && moment(this.state.author.date).fromNow() || 'loading...'}
            </Typography>
          </CardContent>
        </Card>
    );
  }

  fetchStatus() {
    this.client.repos.getCombinedStatusForRef({
      owner: this.props.owner,
      repo: this.props.repo,
      ref: this.state.branch.commit.sha
    })
        .then(({data}) => {
          console.debug(`Fetched status for commit ${shortSha(this.state.branch.commit.sha)}`, data);
          this.setState({status: data.state})
        })
  }

  fetchCommitDetails() {
    this.client.repos.getCommit({
      owner: this.props.owner,
      repo: this.props.repo,
      sha: this.state.branch.commit.sha
    })
        .then(({data}) => {
          console.debug(`Fetched commit ${shortSha(this.state.branch.commit.sha)}`, data);
          this.setState({...data.commit})
        })
  }
}