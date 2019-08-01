import React, {Component} from 'react';

export class ErrorBoundary extends Component{
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError (error) {
    return {
       error,
      hasError: true
    };
  }

  componentDidCatch(error, info) {
    console.error(error);
    console.log(info);
  }

  render() {
    const {hasError} = this.state;
    if(hasError) {
      return '<h1> Something went wrong</h1>'
    }
    return this.props.children;
  }
}