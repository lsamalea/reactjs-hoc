import React, {Component} from 'react';

export const withSubscription = (WrappedComponent, DataSource, getData) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.handleDataChange = this.handleDataChange.bind(this);
      this.state = {
        data: getData(DataSource, props)
      };
    }
    componentDidMount() {
      DataSource.addChangeListener(this.handleDataChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleDataChange);
    }

    handleDataChange() {
      this.setState((state) => ({
        ...state,
        data: getData(DataSource, this.props)
      }));
    }

    render() {
      const { data } = this.state;
      return <WrappedComponent data={data} {...this.props}/>
    }
  }
}