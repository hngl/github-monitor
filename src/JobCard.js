import React, {Component} from "react";
import Card from "@material-ui/core/Card";
import './JobCard.css'
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import moment from 'moment';
import shortSha from './shortSha'

export default class JobCard extends Component {

  render() {
    let commitDesc = shortSha(this.props.branch.commit.sha);
    if(undefined !== this.props.commit) {
      commitDesc = this.props.commit.commit.message;
    }

    let stateDesc = 'loading...';
    if(undefined !== this.props.commit) {
      stateDesc = this.props.commit.commit.committer.name + ', ' + moment(this.props.commit.commit.committer.date).fromNow()
    }

    let state = 'loading';
    if(undefined !== this.props.commit && undefined !== this.props.commit.state) {
      state = this.props.commit.state;
    }

    return (
        <Card className={"job-card " + state}>
          <CardContent>
            <Typography variant={"headline"} component="h2" className="job-name">
              {this.props.branch.name}
            </Typography>
            <Typography variant={"subheading"} component="h3" className="commit-desc">
              {commitDesc}
            </Typography>
            <Typography component="p" className="commit-desc">
              {stateDesc}
            </Typography>
          </CardContent>
        </Card>
    );
  }
}