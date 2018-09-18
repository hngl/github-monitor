import React, {Component} from "react";
import {Card, CardBody, CardText, CardTitle} from "reactstrap";
import './BranchCard.css'

export default class BranchCard extends Component {
  constructor(props) {
    super(props);
    this.state = {branch: props.branch};
    this.client = props.client;
    this.fetchStatus();
    this.fetchCommitDetails();
  }

  render() {
    return (
        <Card className={"branch-card " + this.state.status}>
          <CardBody>
            <CardTitle className="branch-name">
              {this.state.branch.name}
            </CardTitle>
            <CardText>
              {this.state.branch.commit.sha.substring(0, 6)}
            </CardText>
          </CardBody>
        </Card>
    )
        ;
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
          this.setState({
            
          })
        })
  }
}