import React, {Component} from "react";
import Card from "@material-ui/core/Card";
import './JobCard.css'
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";

export default class JobCard extends Component {
  constructor(props) {
    super(props);
    this.state = {branch: props.branch};
    this.client = props.client;
    this.fetchStatus();
    this.fetchCommitDetails();
  }

  render() {
    return (
        <Card className={"job-card " + this.state.status}>
          <CardContent>
            <Typography variant={"headline"} component="h2" className="job-name">
              {this.state.branch.name}
            </Typography>
            <Typography component="p">
              {this.state.branch.commit.sha.substring(0, 6)}
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
          console.debug('Fetched status', data);
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
          console.debug('Fetched commit', data);
          this.setState({})
        })
  }
}