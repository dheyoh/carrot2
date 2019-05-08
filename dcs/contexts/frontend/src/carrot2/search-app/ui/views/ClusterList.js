import { Icon } from "@blueprintjs/core";
import classNames from "classnames";
import PropTypes from "prop-types";

import React from 'react';
import { view } from 'react-easy-state';
import './ClusterList.css';
import { Loading } from "../Loading";

function TopCluster(props) {
  const cluster = props.cluster;
  const subclusters = cluster.clusters || [];
  const hasSubclusters = subclusters.length > 0;

  const meta = `(${cluster.size} docs` + (hasSubclusters ? `, ${cluster.clusters.length} subclusters)` : ")");
  const labels = cluster.labels.join(", ");

  const clusterSelectionStore = props.clusterSelectionStore;
  const className = classNames("TopCluster", {
    "with-subclusters": hasSubclusters,
    "selected": clusterSelectionStore.isSelected(cluster)
  });

  return (
    <div className={className} onClick={() => clusterSelectionStore.toggleSelection(cluster)}>
      <Icon className="icon" icon="lightbulb" intent="warning" />
      <span className="labels">{labels}</span>{" "}
      <span className="meta">{meta}</span>

      <div className="subclusters">
        {
          subclusters.map((subcluster) =>
            <SubClusterView key={subcluster.id} cluster={subcluster} clusterSelectionStore={clusterSelectionStore} />)
        }
      </div>
    </div>
  );
}

const TopClusterView = view(TopCluster);

function SubCluster(props) {
  const cluster = props.cluster;
  const labels = cluster.phrases.join(", ");
  const meta = `(${cluster.size})`;
  const metaTitle = `(${cluster.size} docs)`;
  const clusterSelectionStore = props.clusterSelectionStore;

  const className = classNames("SubCluster", { "selected": clusterSelectionStore.isSelected(cluster) });

  return (
    <span className={className} onClick={(e) => { e.stopPropagation(); clusterSelectionStore.toggleSelection(cluster)} }>
      <span className="icon"><Icon icon="folder-close" intent="warning" iconSize="0.9em" />{"\u00a0"}</span>
      <span className="labels">{labels}</span>{"\u00a0"}
      <span className="meta" title={metaTitle}>{meta}</span>{" "}
    </span>
  );
}

const SubClusterView = view(SubCluster);

export function ClusterList(props) {
  return (
    <div className="ClusterList ">
      <Loading loading={props.clusterStore.loading}>
        {
          props.clusterStore.clusters.map(cluster =>
            <TopClusterView cluster={cluster} key={cluster.id} clusterSelectionStore={props.clusterSelectionStore} />)
        }
      </Loading>
    </div>
  );
}

ClusterList.propTypes = {
  clusterStore: PropTypes.object.isRequired,
  clusterSelectionStore: PropTypes.object.isRequired
};